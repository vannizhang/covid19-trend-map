declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'covid19-trend-map' {

    import IGraphic from 'esri/Graphic';

    type Covid19CasesByTimeFeature = {
        attributes: {
            dt: string;
            Confirmed: number;
            Deaths: number;
            NewCases: number;
            Population: number;
            NewDeaths?: number;
        }
    };

    type Covid19TrendName = 'confirmed' | 'death' | 'new-cases';

    type COVID19TrendCategoryType = 'Emergent' | 'Spreading' | 'Epidemic' | 'Controlled' | 'End Stage' | 'Zero Cases';

    type PathFrame = {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    }

    type PathData = {
        path: number[][];
        frame?: PathFrame;
    }

    type Covid19TrendPaths = {
        confirmed: PathData;
        deaths: PathData;
        newCases: PathData;
    }

    type Covid19TrendData = {
        attributes: any
        geometry: {
            x: number;
            y: number;
        };
    } & Covid19TrendPaths;

    type Covid19TrendDataQueryResponse = {
        features: Covid19TrendData[];
        frames:{
            confirmed: PathFrame;
            deaths: PathFrame;
            newCases: PathFrame;
        }
    }

    type QueryLocation4Covid19TrendData = {
        graphic: IGraphic;
        locationName: string;
    }

    type Covid19LatestNumbersFeature = {
        Confirmed: number;
        Deaths: number;
        NewCases: number;
        Population: number;
        TrendType: COVID19TrendCategoryType;
    };

    type Covid19LatestNumbers = {
        [key: string]: Covid19LatestNumbersFeature
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
        Covid19LatestNumbers
    }
}