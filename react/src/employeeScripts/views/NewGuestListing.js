import React from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import styles from "public/style/newListing.module.css";
import queryString from "query-string";
import {integerMoneyToDecimal, integerToMoneyString} from "miscFunctions";
import Spinner from "microComponents/LoaderAnimation";


class NewListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: 1,
            price: 1,
            description: "",
            pictures: [],
            condition: 0,
            categoryOptions: [],
            filterTypes: [],
            listingId: 0,
            listingMode: 0, //0 = new listing, 1 = edit listing, 2 = draft mode
            formError: "",
            isDataLoading: false,
            currentPage:0,


            predefItemSearch:"",
            isUnlistedItemModalDisplayed:false,
            recommendItemInput:"",
            blockAutofillDiv:false,
            predefItemsSearchResult:[],
            predefItemId:-1,
            predefItemName:"",
            allGuestUsers:[],

            guestUserSelect:0
        }

        this.pictureInputRef = React.createRef();
        this.predefItemAutofillRef = React.createRef();
        this.predefItemInputRef = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.removePicture = this.removePicture.bind(this);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.postListing = this.postListing.bind(this);
        // this.fetchFilters = this.fetchFilters.bind(this);
    }

    componentDidMount() {
        let listingId;
        let listingMode;
        if (queryString.parse(window.location.search).listingid && queryString.parse(window.location.search).listingmode) {
            listingId = queryString.parse(window.location.search).listingid;
            listingMode = queryString.parse(window.location.search).listingmode;
            if (listingMode == 1 || listingMode == 2) {
                axios.get(window.api_prefix+"/listingDetails?id=" + listingId).then(resp => {
                    let listingDetails = resp.data.listingDetails;
                    let filters = resp.data.filters;
                    if (listingDetails) {
                        this.setState({
                            title: listingDetails.title,
                            price: integerMoneyToDecimal(listingDetails.price),
                            condition: listingDetails.condition,
                            description: listingDetails.description,
                            pictures: listingDetails.pictures,
                            category: listingDetails.categoryid,
                            listingMode: 1,
                            currentPage:1,
                            listingId: listingId
                        });
                    } else {
                        this.setState({
                            listingMode: 0
                        });
                    }
                });
            } else {
                axios.get(window.api_prefix+"/getAllGuestUsers").then(resp=>{
                    this.setState({
                        allGuestUsers:resp.data
                    });
                }).catch(err=>{
                    if(err.response){
                      alert("Error retrieving guest users");
                    }
                });
                this.setState({
                    listingMode: 0
                });
            }
        } else {
            axios.get(window.api_prefix+"/getAllGuestUsers").then(resp=>{
                this.setState({
                    allGuestUsers:resp.data
                });
            }).catch(err=>{
                if(err.response){
                    alert("Error retrieving guest users");
                }
            });
            this.setState({
                listingMode: 0
            });
        }
        axios.get(window.api_prefix+"/allLeafCategories").then(resp => {
            this.setState({
                categoryOptions: resp.data
            });
        }).catch();


        document.addEventListener("click", (e) => {
            if (this.predefItemAutofillRef.current) {
                //search suggest is active
                if (e.target !== this.predefItemAutofillRef.current && !e.target.classList.contains(styles.predefItemAutoFillInnerContainer)) {
                    this.setState({
                        blockAutofillDiv:true
                    })
                }
            }
        });
    }

    handleInputChange(e) {
        const {name, value} = e.target;
        if (name == "category") {
            // this.fetchFilters(value);
            this.setState({
                [name]: value
            });
        } else if(name == "predefItemSearch"){
            this.setState({
                [name]: value,
                blockAutofillDiv:false,
                predefItemsSearchResult:[]
            });
            if(value.length>0){
                axios.get(window.api_prefix+"/searchPredefItemsByName?search="+value).then(resp=>{
                    this.setState({
                        predefItemsSearchResult:resp.data
                    })
                }).catch();
            }
        }else{
            this.setState({
                [name]: value
            });
        }
    }

    handleFilterValueChange(arrayIndex, event) {
        let allFilters = this.state.filterTypes;
        let currentFilter = allFilters[arrayIndex];
        if (currentFilter.type == 0) {
            currentFilter.userSelection = event.target.value;
        } else if (currentFilter.type == 1) {
            currentFilter.userSelection = event.target.value;
            currentFilter.searchValue = "";
        } else if (currentFilter.type == 2) {
            currentFilter.userSelection = event.target.value;
        }
        allFilters[arrayIndex] = currentFilter;
        this.setState({
            filterTypes: allFilters
        });
    }

    handleCustomFilterValueChange(arrayIndex, event) {
        let allFilters = this.state.filterTypes;
        let currentFilter = allFilters[arrayIndex];
        currentFilter.searchValue = event.target.value;
        allFilters[arrayIndex] = currentFilter;
        this.setState({
            filterTypes: allFilters
        });
    }

    removePicture(index) {
        let currentPictures = this.state.pictures;
        currentPictures.splice(index, 1);
        // axios.post(window.api_prefix+"/removeListingPicture").then(resp => {

        // }).catch(err => {

        // });
        this.setState({
            pictures: currentPictures
        });
    }

    handleImageUpload(e) {
        let file = e.target.files;
        try {
            if (!file) {
                throw new Error('Select a file first!');
            }
            let availableNbPictures = 5 - this.state.pictures.length;
            let nbPicturesCompleted = 0;
            this.setState({
                isDataLoading: true
            });
            let nbFiles = file.length;
            for (let i = 0; i < nbFiles; i++) {
                if (i >= availableNbPictures) {
                    this.setState({
                        isDataLoading: false,
                        formError: "You have uploaded the maximum number of pictures. Only " + availableNbPictures + " pictures were uploaded."
                    });
                    return;
                }
                let fileName = file[i].name;
                const formData = new FormData();
                formData.append('file', file[i]);
                axios.post(window.api_prefix+`/uploadListingPicture`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(resp => {
                    nbPicturesCompleted++;
                    if (nbPicturesCompleted == nbFiles) {
                        this.setState({
                            isDataLoading: false
                        });
                    }
                    let currentPictures = this.state.pictures;
                    currentPictures.push(resp.data.Location);
                    this.setState({
                        pictures: currentPictures
                    });
                }).catch(err => {
                    if (err.response) {
                        this.setState({
                            isDataLoading: false,
                            formError: "Your file " + fileName + " could not be uploaded, please try again."
                        });
                    }
                });
            }
            this.pictureInputRef.current.value = null;
        } catch (error) {
            // handle error
            this.setState({
                isDataLoading: false
            });
        }

    }

    postListing() {
        // let filters = this.state.filterTypes;
        // let title = this.state.title;
        // let cat = this.state.category;
        let price = this.state.price;
        let description = this.state.description;
        let condition = this.state.condition;
        let predefType = this.state.predefItemId;
        let predefTypeName = this.state.predefItemName;

        let pictures = this.state.pictures;

        let sellerId = this.state.allGuestUsers[this.state.guestUserSelect].id;

        if(predefType != -1 && predefTypeName.length>0){
            if (price.toString().length > 0 && price.toString().length < 255) {
                if (description.length < 255) {
                    if (pictures.length > 0) {
                        if (pictures.length < 6) {
                            let reqObj = { listingId: this.state.listingId, predefTypeName:predefTypeName, price: price, description: description, sellerId:sellerId ,condition: condition, pictures: pictures, predefType:predefType};
                            if (this.state.listingMode == 1) {
                                axios.post(window.api_prefix+"/editGuestListing", reqObj).then((resp) => {
                                   alert("SUCCESS!!");
                                }).catch(err=>{
                                    if(err.response){
                                        alert("ERROR!");
                                    }
                                });
                            } else {
                                axios.post(window.api_prefix+"/postGuestListing", reqObj).then(resp => {
                                    alert("SUCCESS!!");
                                }).catch(err=>{
                                    if(err.response){
                                        alert("ERROR!");
                                    }
                                });
                            }
                        } else {
                            this.setState({
                                formError: "You have exceeded the amount of authorized pictures. Please remove at least 1 picture."
                            });
                        }
                    } else {
                        this.setState({
                            formError: "Please upload at least 1 picture."
                        });
                    }
                } else {
                    this.setState({
                        formError: "Your listing description should be between 1 and 255 characters."
                    });
                }
            } else {
                this.setState({
                    formError: "Please fill in a listing price."
                });
            }
        }else{
            this.setState({
                formError: "Please select an item type that we accept."
            });
        }
    }


    render() {
        const { t } = this.props;
        let smallPictures = [];
        //start from second picture
        if (this.state.pictures.length > 1) {
            for (let i = 1; i < this.state.pictures.length; i++) {
                smallPictures.push(<div key={i} style={{ backgroundImage: "url('/assets/landingPage/stockPic3.jpg')" }} className={styles.smallPictureImg}></div>);
            }
        }




        let conditionsOptionsArray = [
            {
                id: 0,
                name: "New (sealed)"
            },
            {
                id: 1,
                name: "Like new"
            },
            {
                id: 2,
                name: "Lightly used"
            },
            {
                id: 3,
                name: "Used"
            },
            {
                id: 4,
                name: "Broken"
            },
            {
                id: 5,
                name: "For parts"
            }
        ];

        let conditionsOptions = conditionsOptionsArray.map((cond, key) => {
            return (
                <option key={key} value={cond.id}>{cond.name}</option>
            );
        });

        let pageTitle = "New listing";

        if (this.state.listingMode == 1) {
            pageTitle = "Edit listing";
        } else if (this.state.listingMode == 2) {
            pageTitle = "Publish draft listing";
        }else if(this.state.listingMode == 0 && this.state.predefItemName.length>0){
            pageTitle = "Selling "+this.state.predefItemName;
        }

        let picturePreviews = this.state.pictures.map((pics, key) => {
            return (
                <div key={key} className={styles.pictureSquare} onClick={() => this.removePicture(key)} style={{ backgroundImage: "url('" + pics + "')" }}>
                    <div>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
                    </div>
                </div>
            );
        });

        let predefItemAutofill = null;
        if(this.predefItemInputRef.current){
            let autofillInputPos = this.predefItemInputRef.current.getBoundingClientRect();
            if(this.state.currentPage != 1 && this.state.predefItemSearch.length > 0 && this.state.blockAutofillDiv == false){
                predefItemAutofill = (
                    <div id={styles.predefItemAutofillContainer} style={{left:autofillInputPos.left, top:autofillInputPos.top+50, width:this.predefItemInputRef.current.offsetWidth}} ref={this.predefItemAutofillRef}>
                        {this.state.predefItemsSearchResult.length == 0 ?
                            <p>No result</p>
                            :
                            this.state.predefItemsSearchResult.map((item, key)=>{
                                return (
                                    <div className={styles.predefItemAutofillInnerContainer} key={key} onClick={()=>{
                                        this.setState(prevState=>({
                                            currentPage:1,
                                            predefItemId:prevState.predefItemsSearchResult[key].id,
                                            predefItemName:prevState.predefItemsSearchResult[key].title
                                        }));
                                    }}>
                                        <p>{item.title}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                );
            }
        }

        let currentPage;

        let guestUserOptions = this.state.allGuestUsers.map((user, key)=>{
            return (
                <option value={key} key={key}>@{user.name}</option>
            );
        });
        if(this.state.currentPage == 1){
            currentPage = (
                <div id={styles.formContainer}>
                    <p className={styles.regularText + " title1"}>{pageTitle}</p>
                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>Seller user name</p>
                    <select value={this.state.guestUserSelect} onChange={this.handleInputChange} className={styles.selectInput + " regularText"} name="guestUserSelect">
                        {guestUserOptions}
                    </select>
                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>In what condition is the item?</p>
                    <select value={this.state.condition} onChange={this.handleInputChange} className={styles.selectInput + " regularText"} name="condition">
                        {conditionsOptions}
                    </select>
                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>At what price will your item be listed?</p>
                    <input min="1" step="0.05" className={styles.textInput + " regularText"} name="price" value={this.state.price} onChange={this.handleInputChange} type="number"></input>

                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>List all defects, errors, missing parts your item might have</p>
                    <textarea id={styles.descriptionTextarea} name="description" value={this.state.description} onChange={this.handleInputChange}></textarea>
                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>Pictures</p>
                    {picturePreviews}
                    {
                        this.state.pictures.length < 5 ?
                            <label id={styles.fileInputLabel} htmlFor={styles.fileInput}>
                                <div>
                                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg" />
                                </div>
                            </label>
                            :
                            null
                    }
                    <input id={styles.fileInput} onChange={this.handleImageUpload} ref={this.pictureInputRef} type="file" accept=".jpg, .jpeg, .png, .svg" multiple></input>
                    <p>{this.state.formError}</p>
                    <button className={"buttonCta regularTextMedium " + styles.ctaButton} onClick={this.postListing}>List now</button>
                </div>
            );
        }else{
            currentPage = (
                <div id={styles.formContainer}>
                    <p className={styles.regularText + " title1"}>{pageTitle}</p>
                    <p className={styles.regularTextHalfMargin + " regularTextMedium"}>What item are you selling?</p>
                    <input ref={this.predefItemInputRef} className={styles.textInput + " regularText"} placeholder={"search for brand, model, color, storage"} name="predefItemSearch" value={this.state.predefItemSearch} onChange={this.handleInputChange} type="text"></input>
                    <p>{this.state.formError}</p>
                </div>
            );
        }
        return (
            <div>
                <div id={styles.topMainContainer}>
                    {currentPage}
                </div>
                {predefItemAutofill}
                {
                    this.state.isDataLoading == true ?
                        <Spinner />
                        :
                        null
                }
            </div>
        );
    }
}


export default withTranslation()(NewListing);
