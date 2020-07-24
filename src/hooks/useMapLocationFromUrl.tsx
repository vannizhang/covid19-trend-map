import {
    useState,
    useEffect
} from 'react';
import { urlFns } from 'helper-toolkit-ts';

export type MapCenterLocation = {
    lat: number;
    lon: number;
    zoom: number;
}

const SearchParamKeyForMapCenterLoc = '@';

const getMapCenterLocationFromUrlSearchParams = ():MapCenterLocation=>{

    const searchParams = urlFns.parseQuery();

    if(!searchParams[SearchParamKeyForMapCenterLoc]){
        return null;
    }

    const values: number[] = searchParams[SearchParamKeyForMapCenterLoc]
        .split(',')
        .map((d:string)=>+d)

    const [ lon, lat, zoom ] = values

    return { lon, lat, zoom };
};

const useMapCenterLocationFromUrl = () => {

    const [ locationFromURL, setMapCenterLocation ] = useState<MapCenterLocation>(getMapCenterLocationFromUrlSearchParams());

    useEffect(()=>{

        if(!locationFromURL){
            return;
        }

        const { lon, lat, zoom } = locationFromURL;

        urlFns.updateQueryParam({
            key: SearchParamKeyForMapCenterLoc,
            value: `${lon},${lat},${zoom}`
        });

    }, [ locationFromURL ]);

    return {
        locationFromURL,
        saveLocationInURL: setMapCenterLocation
    }
}

export default useMapCenterLocationFromUrl
