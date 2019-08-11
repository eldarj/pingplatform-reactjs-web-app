
export default class DateUtils {
    // Formats ISO Date to human readable format
    static formatISODate = (isoDate) => {
        // If the string is not ISO, just return it...
        if(!DateUtils.isISOFormat(isoDate)) {
            return isoDate;
        }
    
        let dt = new Date(isoDate);
        return `${dt.getDate()}.${dt.getMonth()+1}.${dt.getFullYear()}`;
    }
    
    // Checks whether a date string is in ISO format
    //2019-01-01T00:00:00.000+00:00
    static isISOFormat = (dateString) => {
        if(!dateString.includes('T')) return false;
    
        return true;
    }
    
    // Converts Unix (Javascript) ticks to dotnet ticks
    static ticksToDotnetTicks = (ticks) => {
        return ticks ? (621355968e9 + (ticks * 1e4)) : null;
    }
    
    // Converts dotnet ticks to Unix (Javascript) ticks
    static dotnetTicksToTicks = (dotnetTicks) => {
        return dotnetTicks ? ((dotnetTicks - 621355968e9) / 1e4) : null;
    }
    
    // Converts dotnet ticks to Javascript date
    static dotnetTicksToDate = (dotnetTicks) => {
        return dotnetTicks ? new Date(this.dotnetTicksToTicks(dotnetTicks)) : dotnetTicks;
    }

    // Generates dotnet ticks
    static dotnetTicksNow = () => {
        return this.ticksToDotnetTicks(Date.now());
    }

    // Returns 'smart' labels for message-sent date and time
    static dotnetTicksToSmartFormat = (dotnetTicks) => {
        if (dotnetTicks) {
            let currentJSTicks = Date.now();
            let JSTicks = this.dotnetTicksToTicks(dotnetTicks);
            let diffTicks = currentJSTicks - JSTicks;

            // we want to display 'just now' for less than 120 seconds, 'min ago' for less than 50 minutes, and 'hour ago' for less than 70 minutes
            let result;
            if ((result = diffTicks / 1000) < 120) return `just now`;
            if ((result = result / 60) < 50) return `${parseFloat(result).toFixed(0)} min ago`;
            if (result < 70) return `hour ago`;

            // if we don't display the above labels, we want to calculate the diff and get 'hours:minutes', 'month.day', or 'month.year'
            let date = this.dotnetTicksToDate(dotnetTicks);			
            
            if ((result = diffTicks / (1000 * 60 * 60)) < 24) return `${date.getUTCHours()}:${date.getUTCMinutes()}`;
            if ((result = diffTicks / (1000 * 60 * 60 * 24)) < 365) return `${date.getUTCMonth()+1}.${date.getUTCDate()}`;
            
            return `${date.getUTCDate()}.${date.getUTCMonth()+1}.${date.getUTCFullYear()}`;
        }
        return '';
    }
}

