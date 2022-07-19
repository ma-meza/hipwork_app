const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]


module.exports.timeElapsedCalculator = (epochTime) =>{
    let parsedDate = new Date(epochTime*1000);
    let now = new Date();

    let deltaMinutes = Math.abs(now.getMinutes() - parsedDate.getMinutes());
    let deltaHours = Math.abs(now.getHours() - parsedDate.getHours());
    let deltaDays = Math.abs(now.getDate() - parsedDate.getDate());
    let deltaMonth = Math.abs(now.getMonth() - parsedDate.getMonth());
    let deltaYear = Math.abs(now.getFullYear() - parsedDate.getFullYear());


    if(parsedDate.getDate() == now.getDate() && parsedDate.getMonth() == now.getMonth() && parsedDate.getFullYear() == now.getFullYear() && parsedDate.getHours() == now.getHours()){
        //same hour, check how many minutes ago
        if(deltaMinutes == 0){
            return "1min";
        }else{
            return deltaMinutes+"min";
        }
    }else if(parsedDate.getDate() == now.getDate() && parsedDate.getMonth() == now.getMonth() && parsedDate.getFullYear() == now.getFullYear()){
        //same day, check how many hours ago
        if(deltaHours == 0){
            return "1h";
        }else{
            return deltaHours+"h";
        }
    }else if(parsedDate.getMonth() == now.getMonth() && parsedDate.getFullYear() == now.getFullYear()){
        //same month, check how many days ago
        if(deltaDays == 0){
            return "1d";
        }else{
            return deltaDays+"d";
        }
    }else if(parsedDate.getFullYear() == now.getFullYear()){
        //same year, check how many months ago
        if(deltaDays<30){
            return deltaDays+"d";
        }else if(deltaMonth == 0){
            return "1m";
        }else{
            return deltaMonth+"m";
        }
    }else{
        //not same year, check how many years ago
        if(deltaYear == 0){
            return "1y";
        }else{
            return deltaYear+"y";
        }
    }
}




module.exports.moneyParser = (money) =>{
    let left = Math.floor(Number(money) / 100);
    let right = Number(money) % 100;
    return "$"+left+"."+right;
  }
module.exports.scheduleParser = (start, end) => {
    let startSplit = start.split(" ");
    let endSplit = end.split(" ");
  
    let startDate = startSplit[0].split("-");
    let endDate = endSplit[0].split("-");
  
    let startTime = startSplit[1].split(":");
    let endTime = endSplit[1].split(":");
  
    let startDateString = monthNames[Number(startDate[1])]+" "+startDate[2]+", "+startDate[0]+" - ";
    let startTimeString = startTime[0]+":"+startTime[1];
    let endTimeString = endTime[0]+":"+endTime[1];
    return startDateString+startTimeString+" to "+endTimeString;
  }

  module.exports.timeParser = (time) =>{
    const splitted = time.split(":");
    return splitted[0]+":"+splitted[1];
  }

  module.exports.timestampParser = (ts) =>{
    let dateTime = new Date(ts*1000);
    return monthNames[dateTime.getMonth()]+" "+dateTime.getDate()+", "+dateTime.getFullYear()+" - "+dateTime.getHours()+":"+dateTime.getMinutes();

  }