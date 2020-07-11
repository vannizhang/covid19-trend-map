declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'covid19-trend-map' {
    type TrendData = 'confirmed' | 'death' | 'new-cases';

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
        confirmed: number[];
        deaths: number[];
        newCases: number[];
    };

    export {
        TrendData,
        Covid19USCountyTrendData
    }
}