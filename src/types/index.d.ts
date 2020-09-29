declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'covid19-trend-map' {
    // import IGraphic from 'esri/Graphic';

    type Covid19CasesByTimeFeature = {
        attributes: {
            dt: string;
            Confirmed: number;
            Deaths: number;
            NewCases: number;
            Population: number;
            NewDeaths?: number;
        };
    };

    type Covid19TrendName = 'confirmed' | 'death' | 'new-cases';

    type COVID19TrendCategoryType =
        | 'Emergent'
        | 'Spreading'
        | 'Epidemic'
        | 'Controlled'
        | 'End Stage'
        | 'Zero Cases';

    type PathFrame = {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    };

    type PathData = {
        path: number[][];
        frame?: PathFrame;
    };

    type Covid19TrendPaths = {
        confirmed: PathData;
        deaths: PathData;
        newCases: PathData;
    };

    type Covid19TrendData = {
        attributes: any;
        geometry: {
            x: number;
            y: number;
        };
    } & Covid19TrendPaths;

    type Covid19TrendDataQueryResponse = {
        features: Covid19TrendData[];
        frames: {
            confirmed: PathFrame;
            deaths: PathFrame;
            newCases: PathFrame;
        };
    };

    type QueryLocationFeature = {
        attributes: any;
        geometry: {
            rings: number[][][];
            spatialReference: {
                latestWkid: number;
                wkid: number;
            };
        };
    };

    type QueryLocation4Covid19TrendData = {
        graphic: QueryLocationFeature;
        locationName: string;
    };

    type Covid19LatestNumbersFeature = {
        Name: string;
        Confirmed: number;
        Deaths: number;
        NewCases: number;
        NewDeaths: number;
        NewCases100Days: number;
        NewDeaths100Days: number;
        Population: number;
        TrendType: COVID19TrendCategoryType;
    };

    type Covid19LatestNumbers = {
        [key: string]: Covid19LatestNumbersFeature;
    };

    interface Covid19TrendDataWithLatestNumbers extends Covid19TrendData {
        attributes: {
            FIPS: string;
            Confirmed: number;
            Deaths: number;
            ConfirmedPerCapita: number;
            DeathsPerCapita: number;
            CaseFatalityRate: number;
            CaseFatalityRate100Day: number;
        };
    }

    export {
        PathData,
        PathFrame,
        Covid19TrendName,
        COVID19TrendCategoryType,
        Covid19TrendPaths,
        Covid19TrendData,
        Covid19TrendDataQueryResponse,
        Covid19CasesByTimeFeature,
        QueryLocation4Covid19TrendData,
        Covid19LatestNumbersFeature,
        Covid19LatestNumbers,
        QueryLocationFeature,
        Covid19TrendDataWithLatestNumbers,
    };
}
