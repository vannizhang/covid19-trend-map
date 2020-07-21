import React, {
    useEffect,
    useState
} from 'react'

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IPoint from 'esri/geometry/Point';
import IGraphic from 'esri/Graphic';

type Props = {
    itemId: string;
    outFields?: string[];
    mapView?:IMapView;
    visibleScale?: {
        min: number;
        max: number;
    }
    onSelect: (feature:IGraphic)=>void;
}

const QueryTaskLayer:React.FC<Props> = ({
    itemId,
    outFields,
    mapView,
    visibleScale,
    onSelect
}) => {

    const [ layer, setLayer ] = useState<IFeatureLayer>();

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

        if( mapView.scale < layer.minScale && 
            mapView.scale > layer.maxScale
        ){
            const results = await layer.queryFeatures({
                where: '1=1',
                geometry: mapView.toMap(event),
                returnGeometry: true,
                outFields: outFields || ['*']
            });
    
            if(results.features && results.features.length){
                onSelect(results.features[0]);
            }
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
        }
    }, [layer])

    return null;
}

export default QueryTaskLayer
