declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

declare module 'covid19-trend-map' {

    type Covid19CasesByTimeFeature = {
        attributes: {
            dt: string;
            Confirmed: number;
            Deaths: number;
            NewCases: number;
            Population: number;
        }
    };
    
    type Covid19TrendName = 'confirmed' | 'death' | 'new-cases';

    type PathData = {
        path: number[][];
        frame: {
            xmin: number;
            ymin: number;
            xmax: number;
            ymax: number;
        };
    }

    type Covid19TrendPaths = {
        pathConfirmed: PathData;
        pathDeaths: PathData;
        pathNewCases: PathData;
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
    } & Covid19TrendPaths;

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
    } & Covid19TrendPaths;

    export {
        PathData,
        Covid19TrendName,
        Covid19TrendPaths,
        Covid19USCountyTrendData,
        Covid19USStateTrendData,
        Covid19CasesByTimeFeature
    }
}