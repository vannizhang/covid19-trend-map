import React, {
    useEffect,
    useState
} from 'react';

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';
import IPoint from 'esri/geometry/Point';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import IwatchUtils from 'esri/core/watchUtils';

import {
    PathData,
    Covid19TrendName,
    Covid19TrendData
} from 'covid19-trend-map';

type Props = {
    activeTrend: Covid19TrendName;
    size?: number;
    visibleScale?: {
        min: number;
        max: number;
    }
    mapView?:IMapView;
}

type Covid19TrendLayerProps = {
    features: Covid19TrendData[]
} & Props;

const Covid19TrendLayer:React.FC<Covid19TrendLayerProps> = ({
    activeTrend,
    features,
    visibleScale,
    size = 20,
    mapView
}) => {

    const [ trendLayer, setTrendLayer ] = useState<IGraphicsLayer>();

    const init = async()=>{
        type Modules = [
            typeof IGraphicsLayer,
            typeof IwatchUtils
        ];

        try {
            const [ 
                GraphicsLayer,
                watchUtils
            ] = await (loadModules([
                'esri/layers/GraphicsLayer',
                'esri/core/watchUtils'
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer({
                minScale: visibleScale && visibleScale.min,
                maxScale: visibleScale && visibleScale.max
            });

            mapView.map.add(layer);

            setTrendLayer(layer);

            // watchUtils.watch(layer, 'loadStatus', (status)=>{
            //     console.log('loadStatus', status)
            // })

        } catch(err){
            console.error(err);
        }
    };

    const draw = async(features:Covid19TrendData[])=>{

        type Modules = [
            typeof ICIMSymbol,
            typeof IGraphic,
            typeof IPoint
        ];

        try {
            const [ 
                CIMSymbol,
                Graphic,
                Point
            ] = await (loadModules([
                'esri/symbols/CIMSymbol',
                'esri/Graphic',
                'esri/geometry/Point'
            ]) as Promise<Modules>);

            const graphics = features.map(feature=>{
                const {
                    geometry,
                    confirmed,
                    deaths,
                    newCases
                } = feature;

                const pathDataByTrendName: { [key in Covid19TrendName]: PathData } = {
                    'confirmed': confirmed,
                    'death': deaths,
                    'new-cases': newCases
                };

                const pathData = pathDataByTrendName[activeTrend];

                const {
                    frame,
                    path
                } = pathData;

                // Create the CIM symbol:
                //  - set the size value
                //  - assign the generated path to the marker's geometry
                const symbol = new CIMSymbol({
                    data: {
                        type: 'CIMSymbolReference',
                        symbol: {
                            type: "CIMPointSymbol",
                            symbolLayers: [
                                {
                                    type: "CIMVectorMarker",
                                    enable: true,
                                    scaleSymbolsProportionally: false,
                                    respectFrame: false,
                                    size,
                                    frame,
                                    markerGraphics: [{
                                        type: "CIMMarkerGraphic",
                                        geometry: {
                                            paths: [path]
                                        },
                                        symbol: {
                                            type: "CIMLineSymbol",
                                            symbolLayers: [{
                                                type: "CIMSolidStroke",
                                                width: 1,
                                                color: [161, 13, 34, 255]
                                            }]
                                        }
                                    }]
                                }
                            ]
                        }
                    }
                });

                const graphic = new Graphic({
                    geometry: new Point({
                        latitude: geometry.y,
                        longitude: geometry.x
                    }),
                    symbol
                })

                return graphic;
            });

            trendLayer.addMany(graphics);

        } catch(err){   
            console.error(err);
        }
    };

    // const processLargeArrayAsync = (items: any[], fn:Function, chunk?:number)=>{
    //     chunk = chunk || 100;

    //     let index = 0;

    //     const doChunk = ()=>{
    //         let cnt = chunk;
    //         while (cnt-- && index < items.length) {
    //             // callback called with args (value, index, array)

    //             const itemsToProcess = items.slice(index, index + chunk);

    //             fn.call(this, itemsToProcess);
    //             index += chunk;
    //         }

    //         if (index < items.length) {
    //             // set Timeout for async iteration
    //             setTimeout(doChunk, 1);
    //         }
    //     };

    //     doChunk();
    // }

    useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    useEffect(()=>{
        if(trendLayer && features){
            // draw();

            trendLayer.removeAll();
            draw(features);
            // processLargeArrayAsync(features, draw, 200)
        }
    }, [trendLayer, features, activeTrend]);

    return null;
}

export default Covid19TrendLayer;
