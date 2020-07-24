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
            typeof IGraphicsLayer
        ];

        try {
            const [ 
                GraphicsLayer,
            ] = await (loadModules([
                'esri/layers/GraphicsLayer',
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer({
                minScale: visibleScale && visibleScale.min,
                maxScale: visibleScale && visibleScale.max
            });

            mapView.map.add(layer);

            setTrendLayer(layer);

        } catch(err){
            console.error(err);
        }
    };

    const draw = async()=>{

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

            trendLayer.removeAll();

            // Iterate over each feature
            for (const feature of features) {

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

                // Add the symbol on the county's centroid
                trendLayer.add(graphic);
            }

        } catch(err){   
            console.error(err);
        }
    };

    useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    useEffect(()=>{
        if(trendLayer && features){
            draw();
        }
    }, [trendLayer, features, activeTrend]);

    return null;
}

export default Covid19TrendLayer;
