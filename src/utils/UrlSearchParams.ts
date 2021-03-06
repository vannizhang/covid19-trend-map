import { urlFns } from 'helper-toolkit-ts';

import { MapCenterLocation } from '../components/MapView/MapView';

import { Covid19TrendName } from 'covid19-trend-map';

import { 
    GridListSortField
} from '../store/reducers/UI';

type HashParams = {
    [key: string]: string;
};

type UrlHashParamKey = '@' | 'trendCategories' | 'trendType' | 'grid' | 'sort' | 'q';

const DefaultHashParams: HashParams = urlFns.parseHash();

const TrendTypesValuesInOrder: Covid19TrendName[] = [
    'new-cases',
    'death',
    'confirmed',
];

const SortFieldValuesInOrder: GridListSortField[] = [
    'CaseFatalityRate100Day',
    'CaseFatalityRate',
    'ConfirmedPerCapita',
    'DeathsPerCapita',
    'Confirmed',
    'Deaths'
]

export const getDefaultValueFromHashParams = (key: UrlHashParamKey) => {
    if (key === '@') {
        return getMapLocationFromUrlSearchParams(DefaultHashParams);
    }

    if (key === 'trendType') {
        return getTrendTypeFromUrlSearchParams(DefaultHashParams);
    }

    if( key === 'sort') {
        return getSortFieldFromSearchParams(DefaultHashParams)
    }

    return DefaultHashParams[key] || null;
};

export const updateMapLocation = (mapCenterLocation: MapCenterLocation) => {
    const key: UrlHashParamKey = '@';

    if (!mapCenterLocation) {
        return;
    }

    const { lon, lat, zoom } = mapCenterLocation;

    urlFns.updateHashParam({
        key,
        value: `${lon},${lat},${zoom}`,
    });
};

export const updateTrendCategoriesInURLHashParams = (value: boolean) => {
    const key: UrlHashParamKey = 'trendCategories';

    urlFns.updateHashParam({
        key,
        value: value ? '1' : '0',
    });
};

export const updateTrendTypeInURLHashParams = (value: Covid19TrendName) => {
    const key: UrlHashParamKey = 'trendType';

    const index = TrendTypesValuesInOrder.indexOf(value);

    urlFns.updateHashParam({
        key,
        value: index && index > -1 ? index.toString() : '0',
    });
};

export const updateIsGridListVisibleInURLHashParams = (isVisible: boolean) => {
    const key: UrlHashParamKey = 'grid';

    urlFns.updateHashParam({
        key,
        value: isVisible ? '1' : '0',
    });
};

export const updateSortFieldInURLHashParams = (sortField:GridListSortField) =>{
    const key: UrlHashParamKey = 'sort';

    const index = SortFieldValuesInOrder.indexOf(sortField);

    urlFns.updateHashParam({
        key,
        value: index > -1 ? index.toString() : 'none',
    });
}


export const updateQueryInURLHashParams = (FIPS?:string) =>{
    const key: UrlHashParamKey = 'q';

    urlFns.updateHashParam({
        key,
        value: FIPS || '',
    });
}

const getMapLocationFromUrlSearchParams = (hashParams?: HashParams) => {
    hashParams = hashParams || urlFns.parseQuery();

    const key: UrlHashParamKey = '@';

    if (!hashParams[key]) {
        return null;
    }

    const values: number[] = hashParams[key].split(',').map((d: string) => +d);

    const [lon, lat, zoom] = values;

    return { lon, lat, zoom };
};

const getTrendTypeFromUrlSearchParams = (hashParams?: HashParams) => {
    hashParams = hashParams || urlFns.parseQuery();

    const key: UrlHashParamKey = 'trendType';

    if (!hashParams[key]) {
        return 'new-cases';
    }

    const index =
        hashParams[key] && +hashParams[key] >= 0 && +hashParams[key] <= 3
            ? +hashParams[key]
            : 0;

    return TrendTypesValuesInOrder[index];
};

const getSortFieldFromSearchParams = (hashParams?: HashParams):GridListSortField=>{
    hashParams = hashParams || urlFns.parseQuery();

    const key: UrlHashParamKey = 'sort';

    if(!hashParams[key]){
        return 'CaseFatalityRate100Day';
    }

    const index =  hashParams[key] && +hashParams[key] > -1 && +hashParams[key] < SortFieldValuesInOrder.length 
        ? +hashParams[key]
        : 0;

    return SortFieldValuesInOrder[index];
}
