import React from "react";
import styles from "../public/style/redditStyle.module.css";
import {Link} from "react-router-dom";
import axios from "axios";
import QrCreator from 'qr-creator';


String.prototype.removeCharAt = function (i) {
    var tmp = this.split(''); // convert to an array
    tmp.splice(i , 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
    return tmp.join(''); // reconstruct the string
}


CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }

export default class RedditTool extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            emailAddress:"",
            scraperState:0,

            postTitle:"",
            postPictures:[],
            sellerScore:9,
            priceScore:9,

            errorMessage:""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.resetData = this.resetData.bind(this);
        this.verifyRedditPost = this.verifyRedditPost.bind(this);

        this.qrRef = React.createRef();
        this.canvasRef = React.createRef();
    }

    componentDidMount(){
        if(this.qrRef.current && this.canvasRef.current){

            const canvasElem = this.canvasRef.current;
            const ctx = canvasElem.getContext("2d");
            ctx.beginPath();
            ctx.lineWidth = "20";
            ctx.strokeStyle = "#000";
            ctx.roundRect(150,150,2300,2300, 20).stroke(); //or .fill() for a filled rect

            QrCreator.render({
                text: 'https://siize.com/scanme/w2ijd7i2s',
                radius: 1, // 0.0 to 0.5
                ecLevel: 'H', // L, M, Q, H
                fill: '#000', // foreground color
                background: '#fff', // color or null for transparent
                size: 1980 // in pixels so 33 modules = 60px each module
              }, this.qrRef.current);
              setTimeout(()=>{
                  let childElem = this.qrRef.current.childNodes;
                  let canvas = childElem[0];
                  canvas.style.height = "200px";
                  let canvasDraw = canvas.getContext("2d");
                //   canvasDraw.beginPath();
                //   canvasDraw.fillStyle = "#fff";
                //   canvasDraw.fillRect(720,720,540,540); //x, y, width, height    

                  let baseImage = new Image();
                  baseImage.crossOrigin = "anonymous";
                  baseImage.src = "https://staticassets2020.s3.amazonaws.com/icons/Untitled-1.png";
                  baseImage.onload = ()=>{
                    // canvasDraw.globalAlpha = 0.5
                      canvasDraw.drawImage(baseImage, 750, 750, 540, 540);
                      let canvasUrl = this.qrRef.current.childNodes[0].toDataURL('image/jpg');

                    //   axios.post(window.api_prefix+"/uploadQr", {image:canvasUrl});
                  }
                  //9 modules white square of 60px each             
              }, 1000);
        }
    }

    resetData(){
        this.setState({
            emailAddress:"",
            postTitle:"",
            postPictures:[],
            avgPrice:0,
            sellerScore:0,
            productPrice:0,
            scraperState:0
        });
    }

    verifyRedditPost(){
        if(this.state.emailAddress.length == 0){
            return;
        }
        this.setState({
            scraperState:1,
            errorMessage:""
        });
        axios.get(window.api_prefix+"/scrapeReddit?url="+this.state.emailAddress).then(resp=>{
            console.log(resp.data);
            // {description: Array(2), price: 0, pictures: Array(1), title: "[USA-TX][H] Apple Watch series 4 cellular 44MM [W] PayPal", qtyTrades: 0}

            //check price
            let pricesValues = [];
            console.log(resp.data.description);
            for(let i=0;i<resp.data.description.length;i++){
                let split = resp.data.description[i].split(" ");
                for(let j=0;j<split.length;j++){
                    if(split[j].includes("$")){
                        pricesValues.push(split[j]);
                    }
                }
            }
            let avgPrice = 0;
            let productPrice = 0;
            let priceRatingScore = 0;
            if(pricesValues.length>1 || pricesValues.length == 0){
                avgPrice = 1;
                productPrice = 1;
            }else{
                //check price
                let substring = pricesValues[0];
                for(let i=0;i<substring.length;i++){
                    if(['.',',','1','2','3','4','5','6','7','8','9','0'].indexOf(substring.charAt(i)) == -1){
                        substring = substring.removeCharAt(i);
                        i--;
                    }
                }
                productPrice = substring;
                avgPrice = substring;
            }


            if(avgPrice*0.85> productPrice){
                //cheap price -> score from 7 - 10
                priceRatingScore = 8;
                if(avgPrice*0.3>productPrice){
                    priceRatingScore = 10;
                }else if(avgPrice*0.6>productPrice){
                    priceRatingScore = 9;
                }
            }else if(avgPrice*1.15<productPrice){
                //expensive price -> score from 1 - 3
                priceRatingScore = 1;
                if(avgPrice*1.3<productPrice){
                    priceRatingScore = 3;
                }else if(avgPrice*1.6<productPrice){
                    priceRatingScore = 2;
                }
            }else{
                //average price -> score from 4 - 6
                priceRatingScore = 5;
                if(avgPrice*0.95<= productPrice && avgPrice*1.05>= productPrice){
                    priceRatingScore = 6;
                }
            }
            //check seller nb trades
            let qtyTrades = Number(resp.data.qtyTrades);
            let sellerRating = 9;
            if(qtyTrades <= 3){
                sellerRating = 3;
            }else if(qtyTrades <= 5){
                sellerRating = 5;
            }

            
            this.setState({
                scraperState:2,
                postTitle:resp.data.title,
                postPictures:resp.data.pictures,
                sellerScore:sellerRating,
                priceScore:priceRatingScore
            });
        }).catch(err=>{
            this.setState({
                scraperState:0,
                errorMessage:"The provided url doesn't seem valid, please try again."
            });
        });
    }

    handleInputChange(e){
        const {name, value} = e.target;
        this.setState({
            [name]:value
        });
    }

    render(){

        let content = null;
        if(this.state.scraperState == 0){
            //is at start
            content = (
                <div>
                    <div className={styles.contentContainer}>
                        {/* <p className={styles.regularMarginText+" title1 "+styles.centeredTextDesktop} style={{color:"#fff"}}>Always buy the right clothing size without even trying it.</p> */}
                        {/* <p className={styles.regularMarginText+" title1 "+styles.centeredTextDesktop} style={{color:"#fff"}}>Always be 300% sure you're buying the right clothing size online.</p> */}

                        <p className={styles.regularMarginText+" title1 "+styles.centeredTextDesktop} style={{color:"#fff"}}>Always have peace of mind that you're buying the right clothing size online.</p>

                        <p className={styles.regularMarginText +" regularText "+styles.centeredTextDesktop} style={{color:"#fff"}}>We're building the next-generation of clothing shopping experience. Join our waitlist to get <span className={"regularTextBold"}>early access</span>.</p>
                        <div id={styles.inputContainer}>
                            <input name="emailAddress" value={this.state.emailAddress} onChange={this.handleInputChange} placeholder="Enter email address" className={styles.inputStyle+" regularText"} id={styles.mainInput}></input>
                            <button className={"buttonCta regularTextMedium "+styles.inputButton} id={styles.mainInputButton} onClick={this.verifyRedditPost}>join waitlist</button>
                            {this.state.errorMessage.length>0?<p className={"regularText "+styles.errorMessage}>{this.state.errorMessage}</p>:null}
                        </div>
                    </div>
                    <div className={styles.contentContainer}>
                        <div id={styles.featuresMainContainer}>
                            <div className={styles.featureContainer}>
                                <div className={styles.featureImageContainer}>
                                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/shield-check.svg" />  
                                </div>
                                <div className={styles.featureTextContainer}>
                                    <p className={"title2 "+styles.regularMarginText}>No more waiting lines to try clothes</p>
                                    <p className={"regularText "+styles.noMarginText}>We use our proprietary algorithm to verify wether a seller is trustable based on his transaction history.</p>
                                </div>
                            </div>
                            <div className={styles.featureContainer}>
                                <div className={styles.featureImageContainer}>
                                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/tag.svg" />
                                </div>
                                <div className={styles.featureTextContainer}>
                                    <p className={"title2 "+styles.regularMarginText}>No more returns for wrong-fitting clothes</p>
                                    <p className={"regularText "+styles.noMarginText}>We compare the listing item to similar products previously sold. Never buy overpriced products ever again.</p>
                                </div>
                            </div>
                        </div>    
                    </div>
                    <div className={styles.contentContainer}>
                        <div id={styles.mainPromoVideoDiv}>
                            <div ref={this.qrRef}>

                            </div>
                            <p className={"title2"}>Scan for the perfect clothing size</p>
                        </div>  
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.halfDiv}>
                            <div className={styles.halfDivImgContainer}>

                            </div>
                        </div>
                        <div className={styles.halfDiv}>
                            <p className={"title2"}>Input your basic measurements</p>
                            <p className={"regularText"}>Provide us with your height, weight, desired clothing fit and feet length. We'll keep these in memory to better advise you.</p>
                        </div>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.halfDiv}>
                            <div className={styles.halfDivImgContainer}>

                            </div>
                        </div>
                        <div className={styles.halfDiv}>
                            <p className={"title2"}>Scan an in-store or online QR code to get the best item size for you</p>
                            <p className={"regularText"}>Visit a shoe or clothing partner store and find an item you like. Scan its related QR code and instantly see which size would fit you best. No need to try the piece, just trust us.</p>
                        </div>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.halfDiv}>
                            <div className={styles.halfDivImgContainer}>

                            </div>
                        </div>
                        <div className={styles.halfDiv}>
                            <p className={"title2"}>Tell us how accurate the fit was in order to help our AI better advise you next time</p>
                            <p className={"regularText"}>Providing us with feedback about a clothing fit is important. It'll help our algorithm know you better and understand which sizes of clothes you prefer.</p>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.scraperState == 1){
            //is loading data
            content = (
                <div>
                    <div className={styles.contentContainer}>
                        <img onClick={()=>{this.setState({scraperState:2})}} src="https://staticassets2020.s3.amazonaws.com/icons/spinningLoader.gif" style={{width:"140px", backgroundColor:"black", margin:"150px 0 0 0", left:"50%", transform:"translateX(-50%)", position:"relative", display:"block"}}/>
                        <p className={"regularText"} style={{textAlign:"center", color:"black", width:"100%", maxWidth:"500px", left:"50%", transform:"translateX(-50%)", position:"relative", display:"block", margin:"0 0 30px 0"}}>Reddit post is being verified...</p>
                    </div>
                </div>
            );
        }else if(this.state.scraperState == 2){
            //data received
            content = (
                <div>
                    <div className={styles.contentContainer}>
                        <p className={"regularText"} style={{textAlign:"center", color:"black", width:"100%", maxWidth:"500px", left:"50%", transform:"translateX(-50%)", position:"relative", display:"block", margin:"0 0 30px 0"}}>We’re currently cooking an ultra-trustable pre-owned GPU and laptop marketplace. To get your results and get notified when our marketplace launches, please fill in your email address.</p>
                        <div className={styles.footerInputContainer}>
                            <input name="emailAddress" value={this.state.emailAddress} onChange={this.handleInputChange} placeholder="Email address" className={styles.inputStyle+" regularText"} id={styles.mainInput}></input>
                            <button className={"buttonCta regularTextMedium "+styles.inputButton} id={styles.mainInputButton} onClick={()=>{this.setState({scraperState:3})}}>view results</button>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.scraperState == 3){
            //view received data
            let postPictures = this.state.postPictures.map((pic, key)=>{
                if(key >5){
                    return null;
                }
                return (
                    <div className={styles.postPicturesContainer} key={key}>
                        <img src={pic} />
                    </div>
                );
            });
            
            

            let priceRatingColor = "#F9C80E";
            let priceRatingValue = 'average';
            let priceRatingScore = this.state.priceScore;

            let sellerRatingColor = "green";
            let sellerRatingValue = 'legit';
            let sellerRatingScore = this.state.sellerScore;

            if(priceRatingScore<= 3){
                //cheap price -> score from 7 - 10
                priceRatingColor = "red";
                priceRatingValue = "expensive";
            }else if(priceRatingScore<= 6){
                //expensive price -> score from 1 - 3
                priceRatingColor = "#F9C80E";
                priceRatingValue = "average";
            }else{
                //average price -> score from 4 - 6
                priceRatingColor = "green";
                priceRatingValue = "cheap";
            }


            if(sellerRatingScore<= 3){
                sellerRatingColor = "red";
                sellerRatingValue = "risky";
            }else if(sellerRatingScore<= 6){
                sellerRatingColor = "#F9C80E";
                sellerRatingValue = "no risk";
            }else{
                sellerRatingColor = "green";
                sellerRatingValue = "very legit";
            }
            
            let priceRating = (
                <div className={styles.chartBox} style={{borderColor:priceRatingColor}}>
                    <p className={"regularTextBold "+styles.chartTitle} style={{margin:"0 0 40px 0"}}>Listing price</p>
                    <p className={"megaTitle "+styles.regularMarginText+" "+styles.chartTitle} style={{margin:"0 0 30px 0", color:priceRatingColor}}>{priceRatingScore}/10</p>
                    <p className={"regularText "+styles.noMarginText+" "+styles.chartTitle} style={{margin:"0", color:priceRatingColor}}>{priceRatingValue}</p>
                </div>
            );
            let legitimacyRating = (
                <div className={styles.chartBox} style={{borderColor:sellerRatingColor}}>
                    <p className={"regularTextBold "+styles.chartTitle} style={{margin:"0 0 40px 0"}}>Seller legitimacy</p>
                    <p className={"megaTitle "+styles.regularMarginText+" "+styles.chartTitle} style={{margin:"0 0 30px 0", color:sellerRatingColor}}>{sellerRatingScore}/10</p>
                    <p className={"regularText "+styles.noMarginText+" "+styles.chartTitle} style={{margin:"0", color:sellerRatingColor}}>{sellerRatingValue}</p>
                </div>
            );
            content = (
                <div>
                    <div className={styles.contentContainer}>
                        <p id={styles.postTitleP} className="title1">{this.state.postTitle}</p>
                        {postPictures}
                        <div id={styles.chartsContainer}>
                            {priceRating}
                            {legitimacyRating}
                        </div>
                        <div id={styles.inputContainer}>
                            <button className={"buttonCta regularTextMedium "+styles.inputButton} id={styles.mainInputButton} onClick={this.resetData}>verify another post</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div id={styles.topBar}>
                    <div className={styles.topBarInner}>
                        <img id={styles.topBarLogo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                        <div id={styles.topNavLinks}>
                            <Link className={"regularText"} to="/" onClick={this.resetData}>home</Link>
                            <Link className={"regularText"} to="/about-us">about us</Link>
                        </div>
                    </div>
                </div>
                <div style={{minHeight:"calc(100vh - 50px)", display:"block", position:"relative", paddingTop:"200px"}}>
                    {content}
                </div>
                <div id={styles.footer}>
                    <div className={styles.topBarInner}>
                        <div id={styles.footerLinksContainer}>
                            <Link className={"regularText"} to="/" onClick={this.resetData}>home</Link>
                            <Link className={"regularText"} to="/about-us">about us</Link>
                            <a href="mailto:contact@joincambio.com" className={"regularText"}>contatc@joincambio.com</a>
                            <p className={"regularText"}>{new Date().getFullYear()} Cambio LLC. All rights reserved.</p>
                        </div>
                    </div>
                </div>
                <div id="canvasContainer">
                    <canvas width={2600} height={2600} style={{backgroundColor:"#fff"}} ref={this.canvasRef}/>
                </div>
            </div>
        );
    }
}