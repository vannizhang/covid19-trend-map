import React, {
    useEffect
} from 'react';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IwatchUtils from 'esri/core/watchUtils';

import {
    getDefaultValueFromHashParams,
    updateMapLocation
} from '../../utils/UrlSearchParams';

export type MapCenterLocation = {
    lat: number;
    lon: number;
    zoom: number;
}

interface Props {
    webmapId: string;
};

const locationFromURL = getDefaultValueFromHashParams('@') as MapCenterLocation;

const MapView:React.FC<Props> = ({
    webmapId,
    children
})=>{
    
    const mapDivRef = React.useRef<HTMLDivElement>();

    const [ mapView, setMapView] = React.useState<IMapView>(null);

    const initMapView = async()=>{
  
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [ 
                MapView, 
                WebMap 
            ] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);

            const { lat, lon, zoom } = locationFromURL || {};

            const center = lon && lat  ? [ lon, lat ] : undefined;

            const view = new MapView({
                container: mapDivRef.current,
                center,
                zoom,
                map: new WebMap({
                    portalItem: {
                        id: webmapId
                    }  
                }),
            });

            view.when(()=>{
                setMapView(view);
            });

        } catch(err){   
            console.error(err);
        }
    };

    const addWatchEvent = async()=>{
        type Modules = [typeof IwatchUtils];

        try {
            const [ 
                watchUtils 
            ] = await (loadModules([
                'esri/core/watchUtils'
            ]) as Promise<Modules>);

            watchUtils.whenTrue(mapView, 'stationary', ()=>{
                // console.log('mapview is stationary', mapView.center, mapView.zoom);

                if(mapView.zoom === -1){
                    return;
                }

                const centerLocation:MapCenterLocation = {
                    lat: mapView.center && mapView.center.latitude 
                        ? +mapView.center.latitude.toFixed(3) 
                        : 0,
                    lon: mapView.center && mapView.center.longitude 
                        ? +mapView.center.longitude.toFixed(3) 
                        : 0,
                    zoom: mapView.zoom
                }

                updateMapLocation(centerLocation);
            });

        } catch(err){   
            console.error(err);
        }
    };

    useEffect(()=>{
        loadCss();
        initMapView();
    }, []);

    React.useEffect(()=>{
        if(mapView){
            addWatchEvent();
        }
    }, [ mapView ]);

    return (
        <>
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>
            { 
                React.Children.map(children, (child)=>{
                    return React.cloneElement(child as React.ReactElement<any>, {
                        mapView,
                    });
                }) 
            }
        </>
    );
};

export default MapView;