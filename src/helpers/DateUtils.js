
export default class DateUtils {
    // Formats Iso to human readable
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

    static ticksToDotnetTicks = (ticks) => {
        return ticks ? (621355968e9 + (ticks * 1e4)) : null;
    }

    static dotnetTicksToTicks = (dotnetTicks) => {
        return dotnetTicks ? ((dotnetTicks - 621355968e9) / 1e4) : null;
    }

    static dotnetTicksToDate = (dotnetTicks) => {
        return dotnetTicks ? new Date(this.dotnetTicksToTicks(dotnetTicks)) : dotnetTicks;
    }

    static dotnetTicksToSmartFormat = (dotnetTicks) => {
        if (dotnetTicks) {
            let currentJSTicks = Date.now();
            let JSTicks = this.dotnetTicksToTicks(dotnetTicks);
            let diffTicks = currentJSTicks - JSTicks;

            let result;
            if ((result = diffTicks / 1000) < 120) return `just now`;
            if ((result = result / 60) < 50) return `${parseFloat(result).toFixed(0)} min ago`;
            if (result < 70) return `hour ago`;

            let date = this.dotnetTicksToDate(dotnetTicks);			
            
            if ((result = diffTicks / (1000 * 60 * 60)) < 24) return `${date.getUTCHours()}:${date.getUTCMinutes()}`;
            if ((result = diffTicks / (1000 * 60 * 60 * 24)) < 365) return `${date.getUTCMonth()+1}.${date.getUTCDate()}`;
            
            return `${date.getUTCDate()}.${date.getUTCMonth()+1}.${date.getUTCFullYear()}`;
        }
        return '';
    }
}

