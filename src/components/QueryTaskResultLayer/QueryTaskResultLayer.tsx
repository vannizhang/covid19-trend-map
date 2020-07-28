import React, {
    useState,
    useEffect
} from 'react';

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IGraphic from 'esri/Graphic';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import ISimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import { ThemeStyle } from '../../AppConfig';

type Props = {
    queryResult: IGraphic
    mapView?:IMapView;
}


const QueryTaskResultLayer:React.FC<Props> = ({
    queryResult,
    mapView
}) => {

    const [ graphicLayer, setGraphicLayer ] = useState<IGraphicsLayer>();

    const init = async()=>{
        type Modules = [
            typeof IGraphicsLayer,
        ];

        try {
            const [ 
                GraphicsLayer
            ] = await (loadModules([
                'esri/layers/GraphicsLayer'
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer();

            mapView.map.add(layer);

            setGraphicLayer(layer);

        } catch(err){
            console.error(err);
        }
    };

    const showQueryResult = async()=>{

        type Modules = [
            typeof ISimpleFillSymbol,
        ];

        const [ 
            SimpleFillSymbol
        ] = await (loadModules([
            'esri/symbols/SimpleFillSymbol'
        ]) as Promise<Modules>);

        queryResult.symbol = new SimpleFillSymbol({
            color: [0,0,0,0],
            outline: {  // autocasts as new SimpleLineSymbol()
                color: 'rgba(178,165,132,.7)',
                width: 1
            } 
        });

        graphicLayer.add(queryResult)
    }

    useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    useEffect(()=>{
        if(graphicLayer){

            graphicLayer.removeAll();

            if(queryResult){
                showQueryResult();
            }
            
        }
    }, [queryResult]);

    return null;
}

export default QueryTaskResultLayer
