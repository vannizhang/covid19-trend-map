import {
    COVID19TrendCategoryType
} from 'covid19-trend-map'

export default {
    'webmap-id':'1bff921ddf7044c3b5ba34e8494a2073',
    'us-states-feature-layer-item-id': '99fd67933e754a1181cc755146be21ca',
    'us-counties-feature-layer-item-id': '7566e0221e5646f99ea249a197116605',
    'static-files-host': '/media/covidpulse/',
    'covid19-data-us-states-json': 'us-states-paths.json',
    'covid19-data-us-counties-json': 'us-counties-paths.json',
    'covid19-latest-numbers-json': 'latest-numbers.json',
    'us-counties-layer-visible-scale': {
        'min': 9500000,
        'max': 0
    },
    'us-states-layer-visible-scale': {
        'min': 73957190,
        'max': 9500001
    }
};

export const ThemeStyle = {
    'theme-color-red': '#A10D22',
    'theme-color-khaki': '#E8E2D2',
    'theme-color-khaki-bright': '#EFEADB',
    'floating-panel-box-shadow': '#B1A483',
    'theme-color-khaki-dark': '#B2A584'
};

export const TrendColor: Record<COVID19TrendCategoryType, {
    values: number[],
    hex: string
}> = {
    'Emergent': {
        values: [212,158,198,255],
        hex: '#D49EC6'
    }, //'#D49EC6',
    'Spreading': { 
        values: [165,51,110,255], 
        hex: '#A5336E'
    }, // [165,51,110,255], //'#A5336E',
    'Epidemic': { 
        values: [128,11,76,255], 
        hex: '#800B4C'
    }, // [128,11,76,255], //'#800B4C',
    'Controlled': { 
        values: [147,195,195,255], 
        hex: '#93C3C3'
    }, // [147,195,195,255], //'#93C3C3',
    'End Stage': { 
        values: [91,160,168,255],
        hex: '#5BA0A8'
    }, // [91,160,168,255], //'#5BA0A8', 
    'Zero Cases': { 
        values: [100,100,100,255], 
        hex: '#c8c8c8'
    }, // [100,100,100,255]
};