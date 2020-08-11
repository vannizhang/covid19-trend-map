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
        }
    };
    
    type Covid19TrendName = 'confirmed' | 'death' | 'new-cases';

    type COVID19TrendCategoryType = 'Emergent' | 'Spreading' | 'Epidemic' | 'Controlled' | 'End Stage' | 'Zero Cases';

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

    type QueryLocation4Covid19TrendData = {
        graphic: IGraphic;
        locationName: string;
    }

    export {
        PathData,
        Covid19TrendName,
        COVID19TrendCategoryType,
        Covid19TrendPaths,
        Covid19TrendData,
        Covid19CasesByTimeFeature,
        QueryLocation4Covid19TrendData
    }
}