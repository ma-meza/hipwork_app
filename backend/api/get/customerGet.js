const app = require("express").Router();
const jwt = require('jsonwebtoken');
const sessionMiddlewares = require('../../middlewares/sessionCheck');
const pool = require("../../db.js");
const webpush = require('web-push');
const slackUtil = require("../utils/slackUtils");

app.get("/getAllUsersWaitlist", async function (req, res) {
    try {
        const allUsers = await pool.query("SELECT * FROM waitlist");
        return res.json(allUsers.rows);
    } catch (err) {
        res.sendStatus(500)
        return err.message;
    }
});

app.get("/followedGroups", async function(req, res){
    try{
        let subscriptions = [
            {
                id:1,
              name:"@paulGraham",
              qtitymembers:21,
              qtityposts:16
            },
            {
                id:1,
                name:"@mikeWazouski",
                qtitymembers:21,
              qtityposts:16
              },
              {
                id:1,
                name:"@johnDoe",
                qtitymembers:21,
              qtityposts:16
              },
              {
                id:1,
                name:"@mark31",
                qtitymembers:21,
              qtityposts:16
              },
              {
                id:1,
                name:"@johnCena",
                qtitymembers:21,
              qtityposts:16
              }
          ]
          let communities = [
            {
                id:1,
                name:"Ripple (XRP)",
                qtitymembers:21,
            qtityposts:16
            },
            {
                id:1,
              name:"EUR/USD",
              qtitymembers:21,
              qtityposts:16
          },
          {
            id:1,
              name:"Blackberry (BB)",
              qtitymembers:21,
            qtityposts:16
          },
          {
            id:1,
              name:"Tesla (TSLA)",
              qtitymembers:21,
            qtityposts:16
          },
          {
            id:1,
              name:"GPB/USD",
              qtitymembers:21,
            qtityposts:16
          },
          {
            id:1,
              name:"Bitcoin (BTC)",
              qtitymembers:21,
            qtityposts:16
          }
        ];
        let yourGroup = {
            id:1,
            qtitymembers:12,
            qtityposts:32,
            issubscriptionsetup:false
        }
        return res.status(200).send({communities, subscriptions, yourGroup})
    }catch(e){

    }
});

app.get("/userProfile", async function (req, res) {
    if (req.query.id) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, async function (err, decryptedToken) {
                if (err) {
                    let sql = "SELECT * from users WHERE id=$1";
                    try {
                        let sqlQuery = await pool.query(sql, [req.query.id]);
                        console.log(sqlQuery);
                        return res.status(200).send({userInfos: sqlQuery.rows[0]});
                    } catch (err) {
                        slackUtil.sendErrorLog(err);
                        return res.status(500).send({message: "There has been a server error, please try again."});
                    }
                } else {
                    let sql1 = "SELECT * from users WHERE id=$1";
                    let sql2 = "SELECT * from followUsers where followerid=$1 AND followeduserid=$2";

                    try {
                        let [userInfos, followedInfo] = await Promise.all([pool.query(sql1, [req.query.id]), pool.query(sql2, [decryptedToken.id, req.query.id])]);
                        return res.status(200).send({userInfos: userInfos.rows[0], followedInfo: followedInfo.rows});
                    } catch (err) {
                        slackUtil.sendErrorLog(err);
                        return res.status(500).send({message: "There has been a server error, please try again."});
                    }
                }
            });
        } else {
            let sql = "SELECT * from users WHERE id=$1";
            try {
                let sqlQuery = await pool.query(sql, [req.query.id]);
                console.log(sqlQuery);
                return res.status(200).send({userInfos: sqlQuery.rows[0]});
            } catch (err) {
                slackUtil.sendErrorLog(err);
                return res.status(500).send({message: "There has been a server error, please try again."});
            }
        }
    } else {
        return res.status(400).send({message: "Please provide a user id."});
    }
});

app.get("/usersFollowed", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    let sqlFollow = "SELECT users.name, users.id, users.profilepicture FROM users WHERE id IN (SELECT followeduserid FROM followusers WHERE followerid = $1)";
    try {
        let getFollowed = await pool.query(sqlFollow, [res.locals.userId]);
        console.log(getFollowed);
        res.status(200).send(getFollowed.rows);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/loggedInUserProfile", sessionMiddlewares.sessionLoggedInCheck, async function (req, res) {
    let sql = "SELECT name, bio, shippingAddress, profilePicture, name from users WHERE id=$1";
    try {
        let sqlQuery = await pool.query(sql, [res.locals.userId]);
        return res.status(200).send(sqlQuery.rows[0]);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        return res.status(500).send({message: "There has been a server error, please try again."});
    }
});

app.get("/usernameIsValid", async function (req, res) {
    if (typeof req.query.uname != "undefined") {
        let username = (req.query.uname).toLowerCase();
        let findUname = await pool.query("SELECT COUNT(id) FROM users WHERE lower(name) = $1", [username]);
        try {
            console.log(findUname.rows);
            return res.status(200).send({count: findUname.rows[0].count});
        } catch (err) {
            slackUtil.sendErrorLog(err);
            return res.status(500).send({message: "There has been a server error, please try again."});
        }
    } else {
        return res.status(400).send({message: "Please provide a username."});
    }
});



app.get("/getShippingAddress", sessionMiddlewares.sessionLoggedInCheck, async (req, res)=> {
    try {
        let sql = await pool.query("SELECT shippingAddress FROM users WHERE id = $1 LIMIT 1", [res.locals.userId]);
        res.send(sql.rows[0].shippingaddress);
    } catch (err) {
        slackUtil.sendErrorLog(err);
        res.send("");
    }
});

app.get("/userProfileFromId", async(req, res)=>{
    try{
        let group = {
                id:1,
                  name:"xLaserEyes",
                  qtitymembers:103,
                  membershipprice:12,
                  qtitysignals:73,
                  qtitychats:309,
                  qtityposts:22,
                  interests:[0,1],
                  timestamp:"2021-02-18 20:30:54.643041 +00:00",
                  bio:"Proud self-taught crypto/fx trader. Subscribe for daily signals and cool tips & tricks.\nmy 3 rules:\n-be patient ⌛\n-don't be scared to miss a trade 😴\n-if you work hard, money WILL come 💪",
                  traderscore:0.9,
                  signupdate:"2021-02-18 20:30:54.643041 +00:00"
                }
        res.status(200).send(group);
    }catch(e){
        
    }
});


app.get("/customFeed", async(req, res)=>{
    let posts = [
        {
            type:0, // group post
            id:1,
            groupid:1,
            name:"mark31",
            textcontent:"I really think doge has bottomed! It's now or never guys"         
        },
        {
            type:1, //group signal
            id:2,
            groupid:1,
            name:"cynth_saylor",
            signaltype:0,
            tp:1.38201,
            sl:1.39377,
            entry:1.39147,
            currencyid:32,
            currencyname:"GBP/USD",
            customcurrency:""

        },
        {
            type:2, // group chat
            id:1,
            groupid:1,
            name:"marc31",
            sendername:"m.t.smith",
            senderid:21,
            textcontent:"hey mark31, how important is a retest when we breakout of a trendline?"         
        },
        {
            type:3, //community post
            id:3,
            communityid:6,
            communityname:"Bitcoin",
            ticker:"BTC",
            senderid:32,
            sendername:"jimLaserEyes",
            textcontent:"what's your opinion on Salvadore adopting btc as legal tender?"
        },
        {
            type:1, //group signal
            id:2,
            groupid:1,
            name:"judgeMvp",
            signaltype:0,
            tp:1.38201,
            sl:1.39377,
            entry:1.39147,
            currencyid:32,
            currencyname:"Vechain (VET)",
            customcurrency:""

        },
        {
            type:2, // group chat
            id:1,
            groupid:1,
            name:"mark31",
            sendername:"m.t.smith",
            senderid:21,
            textcontent:"hey mark31, how important is a retest when we breakout of a trendline?"         
        },
    ];
    console.log(posts);

    return res.status(200).send(posts);
});

app.get("/guestFeed", async(req, res)=>{

});

app.get("/userGroupsList", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    console.log(req.query);
    let lowerLimitDate = req.query.lowerLimitDate;
    let higherLimitDate = req.query.higherLimitDate;
    pool.query("SELECT Squad.name, Squad.profile_picture, Squad.group_id, Challenge.start_timestamp, Picture.url FROM Squad, Group_membership LEFT JOIN Challenge ON Challenge.group_id = Group_membership.group_id AND Challenge.start_timestamp >= ? AND Challenge.start_timestamp <= ? LEFT JOIN Picture ON Picture.user_id = ? AND Picture.challenge_start_timestamp = Challenge.start_timestamp AND Picture.challenge_group_id = Group_membership.group_id WHERE Squad.group_id = Group_membership.group_id AND Group_membership.user_id = ?", [lowerLimitDate, higherLimitDate, res.locals.userId, res.locals.userId], (err, results, fields)=>{
// pool.query("SELECT Squad.name, Squad.profile_picture, Squad.group_id, Challenge.start_timestamp, Picture.url FROM Squad, Group_membership, Challenge LEFT JOIN Picture ON Picture.user_id = ? AND Picture.challenge_start_timestamp = Challenge.start_timestamp AND Picture.challenge_group_id = Group_membership.group_id WHERE Squad.group_id = Group_membership.group_id AND Group_membership.user_id = ? AND Challenge.group_id = Group_membership.group_id AND Challenge.start_timestamp >= CURDATE()", [res.locals.userId, res.locals.userId], (err, results, fields)=>{
        if(err){
            console.log(err);
            return res.status(200).send({success:false, message:"There has been a server error, please try again."});
        }
        console.log(results);
        return res.status(200).send({success:true, groups:results});
    });
});

app.get("/groupGallery", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(typeof req.query.groupId != "undefined" && req.query.groupId){
        console.log(req.query);
        pool.query("SELECT url, timestamp, challenge_start_timestamp, Picture.user_id, User.name FROM Picture, User WHERE Picture.challenge_group_id = ? AND User.user_id = Picture.user_id ORDER BY challenge_start_timestamp ASC", [req.query.groupId], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            console.log(results);
            pool.query("SELECT DISTINCT Challenge.start_timestamp, Picture.url FROM Challenge, Picture WHERE Challenge.group_id = ? AND Challenge.start_timestamp = Picture.challenge_start_timestamp AND Picture.user_id=?", [req.query.groupId, res.locals.userId], (err2, results2)=>{
                if(err2){
                    console.log(err2);
                    return res.status(200).send({success:false, message:"There has been a server error, please try again."});
                }
                console.log(results2);
                return res.status(200).send({success:true, pictures:results, ownPictures:results2});
            });
        });
    }else{
        return res.status(200).send({success:false});
    }
});

app.get("/getGroupMessages", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(typeof req.query.id != "undefined" && typeof req.query.timestamp != "undefined" && req.query.id && req.query.timestamp){
        let groupId = req.query.id;
        let challengeTimestamp = req.query.timestamp;
        console.log({challengeTimestamp, groupId});
        pool.query("SELECT timestamp, message, User.name FROM Chat, User WHERE challenge_start_timestamp = ? AND challenge_group_id = ? AND User.user_id = Chat.user_id ORDER BY timestamp DESC", [challengeTimestamp, groupId], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            console.log(results);
            return res.status(200).send({success:true, chat:results});
        });
    }else{
        return res.status(200).send({success:false});
    }
});

app.get("/getProfile", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(!req.query.id){
        pool.query("SELECT qty_coins, profile_picture FROM User WHERE user_id = ? LIMIT 1", [res.locals.userId], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            console.log({coinsQty:results[0].qty_coins});
            return res.status(200).send({success:true, coinsQty:results[0].qty_coins});
        });
    }else{
        pool.query("SELECT name, agreements_acceptation_timestamp FROM User WHERE user_id = ? LIMIT 1", [req.query.id], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            return res.status(200).send({success:true, name:results[0].name, memberDate:results[0].agreements_acceptation_timestamp});
        });
    }
});

app.get("/getUsersNonFriend", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    let nameSearch = "";
    if(req.query.nameSearch){
        nameSearch = req.query.nameSearch;
    }
    console.log(nameSearch);
    pool.query("SELECT name, user_id FROM User WHERE user_id != ? AND user_id NOT IN (SELECT user_2 FROM Friend WHERE Friend.user_1 = ?) AND name LIKE CONCAT('%', ?, '%') LIMIT 25", [res.locals.userId, res.locals.userId, nameSearch], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(200).send({success:false, message:"There has been a server error, please try again."});
        }
        return res.status(200).send({users:result, success:true});
    });
});

app.get("/getFriends", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    let nameSearch = "";
    if(req.query.nameSearch){
        nameSearch = req.query.nameSearch;
    }
    console.log(nameSearch);
    pool.query("SELECT name, user_id FROM User, Friend WHERE Friend.user_1 = ? AND Friend.user_2 = user_id AND Friend.status = 2 AND name LIKE CONCAT('%', ?, '%') LIMIT 25", [res.locals.userId, nameSearch], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(200).send({success:false, message:"There has been a server error, please try again."});
        }
        console.log(result);
        return res.status(200).send({users:result, success:true});
    });
});

app.get("/getFriendsNotInGroup", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.query.groupId){
        console.log(req.query.groupId);
        let nameSearch = "";
        if(req.query.nameSearch){
            nameSearch = req.query.nameSearch;
        }
        pool.query("SELECT name, user_id FROM User, Friend WHERE Friend.user_1 = ? AND Friend.user_2 = user_id AND Friend.status = 2 AND name LIKE CONCAT('%', ?, '%') AND user_id NOT IN (SELECT user_id FROM Group_membership WHERE group_id = ?) LIMIT 25", [res.locals.userId, nameSearch, req.query.groupId], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            return res.status(200).send({users:result, success:true});
        });
    }else{
        return res.status(200).send({success:false, message:"Missing group field."});
    }
});


app.get("/getGroupMembers", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.query.groupId){
        let nameSearch = "";
        if(req.query.nameSearch){
            nameSearch = req.query.nameSearch;
        }
        pool.query("SELECT name, Group_membership.user_id FROM User, Group_membership WHERE group_id = ? AND name LIKE CONCAT('%', ?, '%') AND Group_membership.user_id = User.user_id LIMIT 25", [req.query.groupId, nameSearch], (err, result)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            return res.status(200).send({users:result, success:true});
        });
    }else{
        return res.status(200).send({success:false, message:"Missing group field."});
    }
});

app.get("/getNotifications", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    pool.query("SELECT notif_id, message, photo_url, timestamp, type, related_data FROM Notification WHERE receiver_user_id = ? ORDER BY timestamp DESC LIMIT 25", [res.locals.userId], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(200).send({success:false, message:"There has been a server error, please try again."});
        }
        return res.status(200).send({notifications:result, success:true});
    });
});

app.get("/getChallengeInfos", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.query.groupId && req.query.timestamp){
        console.log(req.query);
        let sqlGetPictures = "SELECT url, timestamp, Picture.user_id, User.name FROM Picture, User WHERE Picture.challenge_group_id = ? AND Picture.challenge_start_timestamp= ? AND User.user_id = Picture.user_id ORDER BY challenge_start_timestamp ASC";
        let sqlGetGroupName = "SELECT name FROM Squad WHERE group_id = ? LIMIT 1";
        pool.query(sqlGetPictures+";"+sqlGetGroupName, [req.query.groupId, req.query.timestamp, req.query.groupId], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            return res.status(200).send({success:true, pictures:results[0], groupInfo:results[1]});
        });
    }else{
        return res.status(200).send({success:false});
    }
});


app.get("/getCommonFriends", sessionMiddlewares.sessionLoggedInCheck, (req, res)=>{
    if(req.query.id){//john - mike       john - marc
        let sqlStatement = "SELECT name, user_id, profile_picture FROM User WHERE user_id IN (SELECT user_1 FROM Friend WHERE user_2 = ? AND status = 2 AND user_1 != ?) AND user_id IN (SELECT user_1 FROM Friend WHERE user_2 = ? AND status = 2 AND user_1 != ?)";
        pool.query(sqlStatement, [req.query.id, res.locals.userId, res.locals.userId, req.query.id], (err, results)=>{
            if(err){
                console.log(err);
                return res.status(200).send({success:false, message:"There has been a server error, please try again."});
            }
            return res.status(200).send({success:true, friends:results});
        });
    }else{
        return res.status(200).send({success:false});
    }
});

module.exports = app;
