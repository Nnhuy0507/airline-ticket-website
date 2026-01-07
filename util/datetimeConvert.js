const moment = require('moment-timezone');
module.exports = {
    convertTimetoAsiaHCM: (datetime) => {
        return datetime ? moment(datetime)
        .tz('Asia/Ho_Chi_Minh')
        .format('YYYY-MM-DD HH:mm:ss') : datetime;
    } 
}