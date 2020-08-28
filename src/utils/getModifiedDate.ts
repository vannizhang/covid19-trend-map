import { subHours } from 'date-fns';

export const getModifiedTime = ()=>{
    const now = new Date();
    const syncHourInUTC = 13 
    const utcYear = now.getUTCFullYear()
    const utcMonth = now.getUTCMonth()
    const utcDate = now.getUTCDate()
    const utcHour = now.getUTCHours()
    // const utcMinutes = now.getUTCMinutes()
    // console.log(now, utcYear, utcMonth, utcDate, utcHour, utcMinutes)

    let modifiedTime = new Date(Date.UTC(utcYear, utcMonth, utcDate, syncHourInUTC));

    if(utcHour < syncHourInUTC){
        modifiedTime = subHours(modifiedTime, 24)
    }

    return modifiedTime.getTime()

}