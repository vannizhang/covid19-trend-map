import {
    urlFns
} from 'helper-toolkit-ts';

import {
    MapCenterLocation
} from '../components/MapView/MapView';

import {
    Covid19TrendName
} from 'covid19-trend-map'

type SearchParams = {
    [key:string]: string
}

type UrlSearchParamKey = '@' | 'trendCategories' | 'trendType';

const DefaultSearchParams:SearchParams = urlFns.parseQuery();

const TrendTypesValuesInOrder:Covid19TrendName[] = ['new-cases', 'death', 'confirmed']

export const getDefaultValueFromSearchParams= (key:UrlSearchParamKey)=>{

    if(key === '@'){
        return getMapLocationFromUrlSearchParams(DefaultSearchParams);
    }

    if(key === 'trendType'){
        return getTrendTypeFromUrlSearchParams(DefaultSearchParams);
    }
    
    return DefaultSearchParams[key] || null;

}

export const updateMapLocation = (mapCenterLocation:MapCenterLocation)=>{

    const key:UrlSearchParamKey = '@';

    if(!mapCenterLocation){
        return;
    }

    const { lon, lat, zoom } = mapCenterLocation;

    urlFns.updateQueryParam({
        key,
        value: `${lon},${lat},${zoom}`
    });
};

export const updateTrendCategoriesInURLSearchParams = (value:boolean)=>{
    const key:UrlSearchParamKey = 'trendCategories';

    urlFns.updateQueryParam({
        key,
        value: value ? '1' : '0'
    });
};

export const updateTrendTypeInURLSearchParams = (value:Covid19TrendName)=>{
    const key:UrlSearchParamKey = 'trendType';

    const index = TrendTypesValuesInOrder.indexOf(value);

    urlFns.updateQueryParam({
        key,
        value: index && index > -1 ? index.toString() : '0'
    });
}

const getMapLocationFromUrlSearchParams = (searchParams?:SearchParams)=>{

    searchParams = searchParams || urlFns.parseQuery();

    const key:UrlSearchParamKey = '@';
    
    if(!searchParams[key]){
        return null;
    }

    const values: number[] = searchParams[key]
        .split(',')
        .map((d:string)=>+d)

    const [ lon, lat, zoom ] = values

    return { lon, lat, zoom };
}

const getTrendTypeFromUrlSearchParams = (searchParams?:SearchParams)=>{

    searchParams = searchParams || urlFns.parseQuery();

    const key:UrlSearchParamKey = 'trendType';

    if(!searchParams[key]){
        return 'new-cases';
    }
    
    const index = searchParams[key] && +searchParams[key] >= 0 && +searchParams[key] <= 3 
        ? +searchParams[key] 
        : 0 ;

    return TrendTypesValuesInOrder[index];
}