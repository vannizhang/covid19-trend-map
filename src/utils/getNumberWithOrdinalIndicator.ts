const OrdinalIndicatorLookup = ['st', 'nd', 'rd', 'th']

export const getNumberWithOrdinalIndicator = (num:number):string => {
    if(!num){
        return '';
    }

    const lastDigit = num % 10;

    const ordinalIndicator = OrdinalIndicatorLookup[lastDigit - 1] || OrdinalIndicatorLookup[3];

    return `${num}${ordinalIndicator}`;
}