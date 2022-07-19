const app = require("express").Router();
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const crypto = require("crypto");
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const webpush = require('web-push');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const slackUtil = require("../utils/slackUtils");




webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_SECRET_KEY)

const oauth2Client = new OAuth2(
    "480633103358-ha764imqtfkiebj0jqolieuupqdepdqq.apps.googleusercontent.com",
    "AkeNhhbcGSYSJB_7vXHNtjw-", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
    refresh_token: "1//04GRQ1ON9A1PgCgYIARAAGAQSNwF-L9IrLEllR9TppAzLyPo7Nyw4ZplOrbShKbhbgYqg22AaXcPqIqA4eaQxv4Evf1zixHXVUnc"
});
const accessToken = oauth2Client.getAccessToken()


const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "contact@joincambio.com",
        clientId: "480633103358-ha764imqtfkiebj0jqolieuupqdepdqq.apps.googleusercontent.com",
        clientSecret: "AkeNhhbcGSYSJB_7vXHNtjw-",
        refreshToken: "1//04GRQ1ON9A1PgCgYIARAAGAQSNwF-L9IrLEllR9TppAzLyPo7Nyw4ZplOrbShKbhbgYqg22AaXcPqIqA4eaQxv4Evf1zixHXVUnc",
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    }
});


app.post("/addUserToWaitlist", async function (req, res) {
    if (typeof req.body.email !== 'undefined' && req.body.email.length < 255 && emailRegex.test(req.body.email) == true) {
        try {
            let responseObj = {};
            const findUsersSameEmail = await pool.query("SELECT email FROM waitlist WHERE email = $1 LIMIT 1", [req.body.email]);
            if (findUsersSameEmail.rows.length > 0) {
                //email already used
                return res.sendStatus(403);
            } else {
                const id = crypto.randomBytes(16).toString("hex");
                responseObj.shareToken = id;
                const newUser = await pool.query("INSERT INTO waitlist (email, referralToken) VALUES($1, $2) RETURNING ID", [req.body.email, id]);
                if (req.body.refToken) {
                    const findReferralUser = await pool.query("SELECT id, email FROM waitlist WHERE referralToken = $1 LIMIT 1", [req.body.refToken]);
                    if (findReferralUser.rows.length > 0) {
                        responseObj.referralEmail = findReferralUser.rows[0].email;
                        const registerReferral = await pool.query("INSERT INTO referrals (originalUserId, newUserId) VALUES($1, $2)", [findReferralUser.rows[0].id, newUser.rows[0].id]);
                    }
                }


                let htmlContent = "<p><span style='font-family: Calibri, sans-serif;'><img src='https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png' style='text-align: center; width: 207px;'></span></p><br><p><span style='font-family: Calibri, sans-serif;'>Hi there,</span></p><pre><span style='font-family: Calibri, sans-serif;'>Thank you! You&apos;ve been added to Cambio&apos;s waitlist.</span></pre><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><span style='font-family: Calibri, sans-serif;'><strong>Interested in priority access?</strong></span></p><p><span style='font-family: Calibri, sans-serif;'>Get early access by referring your friends. <strong>Refer 5 friends:</strong> you&apos;ll skip the waitlist &amp; be in the first batch of users. Just share this link: www.joincambio.com?ref=" + id + "</span></p><p><span style='font-family: Calibri, sans-serif;'>Questions? Email us at: <a href='mailto:contact@joincambio.com'>contact@joincambio.com</a></span></p><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><span style='font-family: Calibri, sans-serif;'>Thanks,</span></p><p><span style='font-family: Calibri, sans-serif;'>The team at Cambio</span></p><p><span style='font-family: Calibri, sans-serif;'><a href='//​www.joincambio.com'>www.joincambio.com</a> <br></span></p><p><span style='font-family: Calibri, sans-serif;'><br></span></p><p><br></p>"


                var mailOptions = {
                    from: "Cambio contact@joincambio.com",
                    to: req.body.email,
                    subject: 'Welcome to Cambio!',
                    html: htmlContent
                }
                smtpTransport.sendMail(mailOptions, (error, response) => {
                    error ? console.log(error) : console.log(response);
                    smtpTransport.close();
                });



                slackUtil.cheerWaitlist(req.body.email);
                return res.status(200).send(responseObj);
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.sendStatus(500);
        }
    } else {
        return res.sendStatus(500);
    }
});

app.post('/signup', async function (req, res) {
    req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : "";
    req.body.username = !isEmpty(req.body.username) ? req.body.username : "";
    let email = req.body.email;
    let uname = req.body.username;
    return jwt.sign(
        {
            id:21211
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
            return res.status(200).json({
                success: true,
                token: token,
                name: uname
            });
        }
    );


    if (!Validator.isEmpty(req.body.email) && !Validator.isEmpty(req.body.password) && !Validator.isEmpty(req.body.username) && (typeof req.body.token != "undefined" || (typeof req.body.guestUserId != "undefined" && typeof req.body.guestUserPassword != "undefined"))) {
        let saltRoundsBcrypt = 10;
        let email = req.body.email;
        let uname = req.body.username;
        try {
                const findUsersSameEmail = await pool.query("SELECT email FROM users WHERE email = $1 LIMIT 1", [email]);
                if (findUsersSameEmail.rows.length > 0) {
                    //email already used
                    return res.status(200).send({ message: "This email already exists.", success:false });
                } else {
                    let findUname = await pool.query("SELECT COUNT(id) FROM users WHERE lower(name) = $1", [uname]);
                    if (findUname.rows[0].count > 0) {
                        return res.status(200).send({ message: "This username is already taken.", success:false });
                    }
                    bcrypt.hash(req.body.password, saltRoundsBcrypt, async function (err, hash) {
                        if (err) {
                            slackUtil.sendErrorLog(err)
                            return res.status(200).send({ message: "There has been a server error, please try again.", success:false });
                        } else {
                            const customer = await stripe.customers.create({ email: email });
                            const newUser = await pool.query("INSERT INTO users (email, password, name, stripecustomerid) VALUES($1, $2, $3, $4) RETURNING id", [email, hash, uname, customer.id]);
                            const payload = {
                                id: newUser.rows[0].id
                            };
                            return jwt.sign(
                                payload,
                                process.env.JWT_SECRET_KEY,
                                {
                                    expiresIn: 31556926 // 1 year in seconds
                                },
                                (err, token) => {
                                   return res.status(200).json({
                                        success: true,
                                        token: token,
                                        name: uname
                                    });
                                }
                            );
                        }
                    });
                }
            
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(200).send({ message: "There has been a server error, please try again.", success:false });

        }
    } else {
        return res.status(200).send({ message: "Please fill in all the fields.", success:false });
    }
});


app.post("/sendVerifSms", async function(req, res){
    let timestamp = Math.floor((new Date()).getTime() / 1000);
    let phoneNumber = !isEmpty(req.body.phone) ? req.body.phone : "";
    let verifType = !isEmpty(req.body.verifType) ? req.body.verifType : "";
    if (!Validator.isEmpty(phoneNumber) && !Validator.isEmpty(verifType)) {
        //generate random 6 digit number
        let min = 100000;
        let max = 999999;
        let code = Math.floor(Math.random() * (max - min +1)) + min;
        pool.query("INSERT INTO Sms_verification(phone, type, code, timestamp) VALUES (?,?,?,?)", [phoneNumber, verifType, code, timestamp], (err, result)=>{
            if(err){
                return res.status(200).send({ message: "There has been a server error, please try again.", success:false });
            }
            return res.status(200).send({success:true});
        });
    } else {
        return res.status(200).send({ message: "Please provide a valid phone number.", success:false });
    }
});



app.post('/login', async function (req, res) {
    req.body.phone = !isEmpty(req.body.phone) ? req.body.phone : "";
    req.body.password = !isEmpty(req.body.password) ? req.body.password : 0;
    pool.query("SELECT Sms_verification.timestamp, user_id, name FROM Sms_verification, User WHERE Sms_verification.phone = ? AND code = ? AND Sms_verification.phone = User.phone LIMIT 1", [req.body.phone, req.body.password], (err, results, fields)=>{
        if(err){
            console.log(err);
            return res.status(200).send({success:false, message:"There has been a server error, please try again."});
        }
        if(results.length == 0){
            return res.status(200).send({success:false, message:"The verification code you entered is not valid."});
        }

        return jwt.sign(
            {
                id:results[0].user_id
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
                return res.status(200).json({
                    success: true,
                    token: token,
                    isAccountSetup: true,
                    name: results[0].name
                });
            }
        );
    });
});

app.post("/submitContactUsForm", function (req, res) {
    if (req.body.email && req.body.message && req.body.name && emailRegex.test(req.body.email) == true) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(500);
    }
});




app.post("/followUser", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (req.body.id && req.body.id != res.locals.userId) {
        try {
            let findFollow = await pool.query("SELECT id FROM followUsers WHERE followerid=$1 AND followeduserId=$2", [res.locals.userId, req.body.id]);
            if (findFollow.rows.length > 0) {
                let deleteFollow = await pool.query("DELETE FROM followUsers WHERE followerid=$1 AND followeduserId=$2", [res.locals.userId, req.body.id]);
                return res.status(200).send({ isFollowing: false });
            } else {
                let followUser = await pool.query("INSERT INTO followusers (followerid, followeduserId) VALUES ($1, $2)", [res.locals.userId, req.body.id]);
                return res.status(200).send({ isFollowing: true });
            }
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});

app.post("/updateProfile", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    if (req.body.bio || req.body.shippingAddress) {
        let propertiesArray = [];
        let sql = "UPDATE users SET";

        let counter = 1;
        if(req.body.bio){
            sql += " bio = $"+counter;
            propertiesArray.push(req.body.bio);
            counter++;
        }
        if(req.body.shippingAddress){
            sql += " shippingAddress = $"+counter;
            propertiesArray.push(req.body.shippingAddress);
            counter++;
        }

        sql+= " WHERE id = $"+counter;
        propertiesArray.push(res.locals.userId);

        try {
            let query = await pool.query(sql, propertiesArray);
            res.sendStatus(200);
        } catch (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        return res.status(400).send({ message: "Please provide your bio." });
    }
});


app.post("/accountSetup", sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    if (typeof req.body.fname != "undefined" && typeof req.body.lname != "undefined" && typeof req.body.countryCode != "undefined" && typeof req.body.followedCategories != "undefined" && req.body.followedCategories instanceof Array) {
        let sql1 = "UPDATE users SET isaccountsetup = true, firstName=$1, lastName=$2, shippingCountry=$3 WHERE id = $4";
        let sql2Values = [res.locals.userId];
        let sql2 = "INSERT INTO followCategories (followerId, categoryId) VALUES ";
        for (let i = 0, index = 2; i < req.body.followedCategories.length; i++, index++) {
            sql2 += "($1, $" + index + "),";
            sql2Values.push(req.body.followedCategories[i].id);
        }
        sql2 = sql2.substring(0, sql2.length - 1);
        try {
            await Promise.all([pool.query(sql1, [req.body.fname, req.body.lname, req.body.countryCode, res.locals.userId]), pool.query(sql2, sql2Values)]);
            console.log("All good");
            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            slackUtil.sendErrorLog(err)
            res.status(500).send({ message: "There has been a server error, please try again." });
        }
    } else {
        console.log("400");
        return res.status(400).send({ message: "Please fill in all the fields." });
    }
});




app.post('/notifSubscribe', sessionMiddlewares.sessionLoggedInCheck, async (req, res) => {
    const subscription = req.body.subscription;
    await pool.query("INSERT INTO notificationKeys (endpoint, privatekey, authkey, userid) VALUES ($1, $2, $3, $4)", [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, res.locals.userId]);
    res.status(200).json({ 'success': true })
});

app.post('/notifUnsubscribe', (req, res) => {
    const subscription = req.body.subscription;

    jwt.verify(req.body.userToken, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
        if (err) {
            slackUtil.sendErrorLog(err)
            return res.status(500).send({ message: "These has been a server error, please try again." });
        } else {
            await pool.query("UPDATE notificationKeys SET isValid = false WHERE endpoint = $1 AND privatekey = $2 AND authkey = $3 AND userid = $4", [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, decryptedToken.id]);
            res.status(200).json({ 'success': true });
        }
    });


});

app.post("/createNewGroup", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.body.groupName && req.body.members){

        const nowEpoch = Math.floor(new Date().getTime() / 1000);
        const groupName = req.body.groupName;
        let sqlCreateGroup = "INSERT INTO Squad (name, creation_date) VALUES (?,?)";
        pool.query(sqlCreateGroup, [groupName, nowEpoch], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });
            }
            pool.query("SELECT group_id FROM Squad WHERE name = ? AND creation_date = ? LIMIT 1", [groupName, nowEpoch], (err2, result2)=>{
                if(err2){
                    console.log(err2);
                    return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });    
                }
                const groupId = result2[0].group_id;
                let sqlCreateMembers = "INSERT INTO Group_membership (group_id, user_id) VALUES ";
                let sqlValuesArray = [];
                for(let i=0;i<req.body.members.length;i++){
                    sqlCreateMembers+="(?,?), ";
                    sqlValuesArray.push(groupId, req.body.members[i]);
                }

                sqlCreateMembers+="(?,?)";
                sqlValuesArray.push(groupId, res.locals.userId);

                console.log(sqlCreateMembers);
                console.log(sqlValuesArray);
                pool.query(sqlCreateMembers, sqlValuesArray, (err3, result3)=>{
                    if(err3){
                        console.log(err3);
                        return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });    
                    }
                    return res.status(200).send({success:true});
                });
            });
        });
    }
});


app.post("/sendChat", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    const nowEpoch = Math.floor(new Date().getTime() / 1000);
    if(req.body.message && req.body.challengeStartTimestamp && req.body.groupId){
        pool.query("INSERT INTO Chat (user_id, challenge_start_timestamp, challenge_group_id, timestamp, message) VALUES (?,?,?,?, ?)", [res.locals.userId, req.body.challengeStartTimestamp, req.body.groupId, nowEpoch, req.body.message]);
        return res.status(200).send({success:true});
    }else{
        return res.status(200).json({ 'success': false });
    }
});

app.post("/sendFriendRequest", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.body.userId && req.body.username){
        let sqlAddFriend = "INSERT INTO Friend (user_1, user_2) VALUES (?,?), (?,?)";
        let notifMessage = "<b%>"+req.body.username+"<%break%> wants to be your friend.";
        let sqlSendNotification = "INSERT INTO Notification (receiver_user_id, message, timestamp, related_data, type) VALUES (?,?,?,?,?)";
        let nowEpoch = Math.floor(new Date().getTime() / 1000);
        let notifRelatedData = '{"user_id":'+res.locals.userId+'}';
        pool.query(sqlAddFriend+";"+sqlSendNotification, [res.locals.userId, req.body.userId, req.body.userId, res.locals.userId, req.body.userId, notifMessage, nowEpoch, notifRelatedData, 0], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});


app.post("/addMemberToGroup", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.body.userId && req.body.groupId && req.body.userName){
        const nameAddition = ", "+req.body.userName;
        console.log(nameAddition);
        let sqlAddMember = "INSERT INTO Group_membership (group_id, user_id) VALUES (?,?)";
        let sqlUpdateGroupName = "UPDATE Squad SET name = CONCAT(name, ?) WHERE group_id = ? AND is_custom_name=false";
        pool.query(sqlAddMember+";"+sqlUpdateGroupName, [req.body.groupId, req.body.userId, nameAddition, req.body.groupId], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});

app.post("/removeMemberFromGroup", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    console.log("YO");
    if(req.body.userId && req.body.groupId && req.body.userName){
        let sqlAddMember = "DELETE FROM Group_membership WHERE user_id = ? AND group_id = ?";
        // let sqlUpdateGroupName = "UPDATE Squad SET name = name+? WHERE group_id = ? AND is_custom_name=false";
        pool.query(sqlAddMember, [req.body.userId, req.body.groupId], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});


app.post("/leaveGroup", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.body.groupId){
        let sqlAddMember = "DELETE FROM Group_membership WHERE user_id = ? AND group_id = ?";
        pool.query(sqlAddMember, [res.locals.userId, req.body.groupId], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});

app.post("/editGroupName", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    console.log(req.body);
    if(req.body.groupId && req.body.newName){
        let sqlEditName = "UPDATE Squad SET name = ?, is_custom_name = true WHERE group_id = ?";
        pool.query(sqlEditName, [req.body.newName, req.body.groupId], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});

app.post("/answerFriendRequest", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(typeof req.body.isApproved != "undefined" && req.body.notifObj){
        let friend_id = JSON.parse(req.body.notifObj.related_data).user_id;
        let sqlEditFriendship;
        if(req.body.isApproved){
            sqlEditFriendship = "UPDATE Friend SET status = 2 WHERE (user_1 = ? AND user_2 = ?) OR (user_1 = ? AND user_2 = ?)";
        }else{
            sqlEditFriendship = "DELETE FROM Friend WHERE (user_1 = ? AND user_2 = ?) OR (user_1 = ? AND user_2 = ?)";
        }
        let sqlDeleteNotif = "DELETE FROM Notification WHERE notif_id = ?";

        pool.query(sqlEditFriendship+";"+sqlDeleteNotif, [res.locals.userId, friend_id, friend_id, res.locals.userId, req.body.notifObj.notif_id], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).json({ 'success': false, message:"There has been a server error, please try again." });   
            }
            return res.status(200).send({success:true});
        });
    }else{
        return res.status(200).json({ 'success': false });
    }
});

module.exports = app;
