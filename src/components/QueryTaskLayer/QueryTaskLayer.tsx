import React, {
    useEffect,
    useState,
    useRef
} from 'react'

import {
    useSelector
} from 'react-redux';

import {
    isMobileSeletor
} from '../../store/reducers/UI'

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
// import IPoint from 'esri/geometry/Point';
import IGraphic from 'esri/Graphic';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import { TooltipPosition } from '../Tooltip/Tooltip';

type Props = {
    url: string;
    // itemId: string;
    outFields?: string[];
    mapView?:IMapView;
    visibleScale?: {
        min: number;
        max: number;
    }
    onStart: ()=>void;
    onSelect: (feature:IGraphic)=>void;

    pointerOnMove: (position: TooltipPosition)=>void;
    featureOnHover: (feature: IGraphic)=>void;
}

const QueryTaskLayer:React.FC<Props> = ({
    url,
    // itemId,
    outFields,
    mapView,
    visibleScale,
    onStart,
    onSelect,
    pointerOnMove,
    featureOnHover
}) => {

    const isMobile = useSelector(isMobileSeletor);

    const layerRef = useRef<IFeatureLayer>();
    const layerViewRef = useRef<IFeatureLayerView>();
    const mouseMoveDelay = useRef<number>();

    const isLayerInVisibleRange = ()=>{
        return ( 
            mapView.scale < layerRef.current.minScale && 
            mapView.scale > layerRef.current.maxScale
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
                url,
                // portalItem: {
                //     id: itemId
                // },
                minScale: visibleScale && visibleScale.min,
                maxScale: visibleScale && visibleScale.max,
                visible: true,
                popupEnabled: false,
                outFields,
                opacity: 0
            });

            mapView.map.add(layer);

            mapView.whenLayerView(layer).then(layerView=>{
                // console.log(layerView)

                layerRef.current = layer;
                layerViewRef.current = layerView;

                initEventListeners();
            })

        } catch(err){
            console.error(err);
        }
    };

    const queryFeatures = async(event:__esri.MapViewClickEvent)=>{
        // console.log(mapView.scale)

        const isVisible = isLayerInVisibleRange();

        if(isVisible){

            onStart();

            const results = await layerViewRef.current.queryFeatures({
                where: '1=1',
                geometry: mapView.toMap(event),
                returnGeometry: true,
                outFields: outFields || ['*']
            });

            onSelect(results.features && results.features.length ? results.features[0] : undefined);
        }
    }

    const initEventListeners = ()=>{

        mapView.on("click", (event)=>{
            queryFeatures(event);
        });

        mapView.on("pointer-leave", ()=>{
            pointerOnMove(undefined);
        })

        mapView.on("pointer-move", (event)=>{

            clearTimeout(mouseMoveDelay.current);

            // mapView.toScreen(event.)
            // console.log(event.x, event.y)

            if(isLayerInVisibleRange() && !isMobile){

                const { x, y } = event;

                pointerOnMove({ x, y });

                mouseMoveDelay.current = window.setTimeout(async()=>{

                    const results = await layerViewRef.current.queryFeatures({
                        where: '1=1',
                        geometry: mapView.toMap(event),
                        returnGeometry: false,
                        outFields: outFields || ['*']
                    });
                    // console.log(results)

                    featureOnHover(results.features[0]);

                }, 50);
            }
        });
    }

    useEffect(() => {
        if(mapView){
            init();
        }
    }, [mapView]);

    return null;
}

export default QueryTaskLayer
