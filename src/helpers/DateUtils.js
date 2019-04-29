
export default class DateUtils {
    static formatISODate = (isoDate) => {
        let dt = new Date(isoDate);
        return `${dt.getDate()}.${dt.getMonth()+1}.${dt.getFullYear()}`;
    }
}
