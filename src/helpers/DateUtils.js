
export default class DateUtils {
    static formatISODate = (isoDate) => {
        // if it's not in an ISO format, just return it..
        if(!DateUtils.isISOFormat(isoDate)) {
            return isoDate;
        }
    
        let dt = new Date(isoDate);
        return `${dt.getDate()}.${dt.getMonth()+1}.${dt.getFullYear()}`;
    }
    
    //2019-01-01T00:00:00.000+00:00
    static isISOFormat = (dateString) => {
        if(!dateString.includes('T')) return false;
    
        return true;
    }
}

