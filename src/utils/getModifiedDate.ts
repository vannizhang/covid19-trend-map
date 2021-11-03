// import { subHours } from 'date-fns';
import { dateFns } from 'helper-toolkit-ts'

export const getModifiedTime = (): number => {
    // const now = new Date();
    // // const syncHourInUTC = 13
    // const utcYear = now.getUTCFullYear();
    // const utcMonth = now.getUTCMonth();
    // const utcDate = now.getUTCDate();
    // const utcHour = now.getUTCHours();

    // // the file can be modified at 13PM, 14PM or 15PM UTC
    // const syncHourInUTC = utcHour >= 13 || utcHour <= 15 ? utcHour : 15;

    // let modifiedTime = new Date(
    //     Date.UTC(utcYear, utcMonth, utcDate, syncHourInUTC)
    // );

    // if (utcHour < syncHourInUTC) {
    //     modifiedTime = subHours(modifiedTime, 24);
    // }

    // return modifiedTime.getTime();

    return dateFns.getRoundedDate(15)
};
