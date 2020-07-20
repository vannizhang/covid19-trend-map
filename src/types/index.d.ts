declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'covid19-trend-map' {
    type TrendData = 'confirmed' | 'death' | 'new-cases';

    type TrendValues = {
        confirmed: number[],
        deaths: number[],
        newCases: number[]
    } 

    type Covid19USCountyTrendData = {
        attributes: {
            NAME: string;
            STATE: string;
            FIPS: string;
        }
        geometry: {
            x: number;
            y: number;
        };
    } & TrendValues;

    type Covid19USStateTrendData = {
        attributes: {
            STATE_NAME: string;
            STATE_FIPS: string;
            STATE_ABBR: string;
            POPULATION: number;
        }
        geometry: {
            x: number;
            y: number;
        };
    } & TrendValues;

    export {
        TrendData,
        Covid19USCountyTrendData,
        Covid19USStateTrendData
    }
}