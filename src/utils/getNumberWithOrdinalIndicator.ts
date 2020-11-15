export const getNumberWithOrdinalIndicator = (num:number):string => {
    if(!num){
        return '';
    }

    const lastDigit = num % 10;
    const last2Digit = num % 100;

    let ordinalIndicator = 'th';

    if(lastDigit === 1 || last2Digit !== 11){
        ordinalIndicator = 'st'
    }

    if(lastDigit === 2 || last2Digit !== 12){
        ordinalIndicator = 'nd'
    }

    if(lastDigit === 3 || last2Digit !== 13){
        ordinalIndicator = 'rd'
    }

    return `${num}${ordinalIndicator}`;
}