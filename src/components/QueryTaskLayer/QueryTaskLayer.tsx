import React, {
    useEffect,
    useState,
    useRef
} from 'react'

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
// import IPoint from 'esri/geometry/Point';
import IGraphic from 'esri/Graphic';

type Props = {
    itemId: string;
    outFields?: string[];
    mapView?:IMapView;
    visibleScale?: {
        min: number;
        max: number;
    }
    onStart: ()=>void;
    onSelect: (feature:IGraphic)=>void;
}

const QueryTaskLayer:React.FC<Props> = ({
    itemId,
    outFields,
    mapView,
    visibleScale,
    onStart,
    onSelect
}) => {

    const [ layer, setLayer ] = useState<IFeatureLayer>();

    const mouseMoveDelay = useRef<number>();

    const isLayerInVisibleRange = ()=>{
        return ( 
            mapView.scale < layer.minScale && 
            mapView.scale > layer.maxScale
        );
    }

    const init = async()=>{

        type Modules = [
            typeof IFeatureLayer
        ];

        try {
            const [ 
                FeatureLayer,
            ] = await (loadModules([
                'esri/layers/FeatureLayer',
            ]) as Promise<Modules>);

            const layer = new FeatureLayer({
                portalItem: {
                    id: itemId
                },
                minScale: visibleScale && visibleScale.min,
                maxScale: visibleScale && visibleScale.max
            });

            setLayer(layer);

        } catch(err){
            console.error(err);
        }
    };

    const queryFeatures = async(event:__esri.MapViewClickEvent)=>{
        // console.log(mapView.scale)

        const isVisible = isLayerInVisibleRange();

        if(isVisible){

            onStart();

            const results = await layer.queryFeatures({
                where: '1=1',
                geometry: mapView.toMap(event),
                returnGeometry: true,
                outFields: outFields || ['*']
            });

            onSelect(results.features && results.features.length ? results.features[0] : undefined);
        }
    }

    useEffect(() => {
        if(mapView){
            init();
        }
    }, [mapView]);

    useEffect(() => {
        if(layer && mapView){
            mapView.on("click", (event)=>{
                queryFeatures(event);
            });

            mapView.on("pointer-move", (event)=>{

                clearTimeout(mouseMoveDelay.current);

                // mapView.toScreen(event.)
                console.log(event.x, event.y)

                if(isLayerInVisibleRange()){

                    mouseMoveDelay.current = window.setTimeout(async()=>{
                        const results = await layer.queryFeatures({
                            where: '1=1',
                            geometry: mapView.toMap(event),
                            returnGeometry: false,
                            outFields: outFields || ['*']
                        });
    
                        console.log(results.features[0]);
    
                    }, 200);
                }
            });
        }
    }, [layer])

    return null;
}

export default QueryTaskLayer
