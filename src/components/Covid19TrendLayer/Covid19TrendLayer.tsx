import React, {
    useEffect,
    useState,
    useRef
} from 'react';

import {
    useSelector
} from 'react-redux';

import {
    showTrendCategoriesSelector,
    activeTrendSelector
} from '../../store/reducers/UI'


import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';
import IPoint from 'esri/geometry/Point';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import IwatchUtils from 'esri/core/watchUtils';

// import IFeatureLayer from 'esri/layers/FeatureLayer';
// import IUniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';
// // import IUniqueValueInfo from 'esri/renderers/support/UniqueValueInfo';

// import ISimpleRenderer from 'esri/renderers/SimpleRenderer';
// import ISimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';

import {
    PathData,
    PathFrame,
    Covid19TrendName,
    Covid19TrendData,
    Covid19TrendDataQueryResponse
} from 'covid19-trend-map';

import {
    TrendColor
} from '../../AppConfig';

type Props = {
    // activeTrend: Covid19TrendName;
    size?: number;
    visibleScale?: {
        min: number;
        max: number;
    },
    // indicate if attributes contains 'trend category type' value from https://www.arcgis.com/home/item.html?id=49c25e0ce50340e08fcfe51fe6f26d1e#overview
    hasTrendCategoriesAttribute?: boolean;
    // itemId?: string;
    // field?: string;
    mapView?:IMapView;

    isLayerInVisibleScaleOnChange?: (visible:boolean)=>void;
}

type Covid19TrendLayerProps = {
    // features: Covid19TrendData[]
    data: Covid19TrendDataQueryResponse
} & Props;


const sizeByTrendName: { [key in Covid19TrendName]: number } = {
    'confirmed': 30,
    'death': 30,
    'new-cases': 60
};

const Covid19TrendLayer:React.FC<Covid19TrendLayerProps> = ({
    // activeTrend,
    data,
    visibleScale,
    size = 20,
    hasTrendCategoriesAttribute = false,
    mapView,

    isLayerInVisibleScaleOnChange
}) => {

    const renderDealy = useRef<number>();
    const activeTrend = useSelector(activeTrendSelector);
    const showTrendCategories = useSelector(showTrendCategoriesSelector);
    
    const [ trendLayer, setTrendLayer ] = useState<IGraphicsLayer>();

    const [ isLayerInVisibleScale, setIsLayerInVisibleScale ] = useState<boolean>(false);

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
                maxScale: visibleScale && visibleScale.max,
                visible: false
            });

            mapView.map.add(layer);

            setTrendLayer(layer);

            watchUtils.whenTrue(mapView, 'stationary', ()=>{
                const isInVisibleScale = (mapView.scale < visibleScale.min && mapView.scale > visibleScale.max);
                setIsLayerInVisibleScale(isInVisibleScale);
            })

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

        trendLayer.graphics.on('after-added', (evt)=>{
            console.log(evt)
        })

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

            const { features, frames } = data;

            const pathFrameByTrendName: { [key in Covid19TrendName]: PathFrame } = {
                'confirmed': frames.confirmed,
                'death': frames.deaths,
                'new-cases': frames.newCases
            };
    
            const frame = pathFrameByTrendName[activeTrend];

            // const graphics = features.map(feature=>{
            //     const {
            //         attributes,
            //         geometry,
            //         confirmed,
            //         deaths,
            //         newCases
            //     } = feature;

            //     const pathDataByTrendName: { [key in Covid19TrendName]: PathData } = {
            //         'confirmed': confirmed,
            //         'death': deaths,
            //         'new-cases': newCases
            //     };

            //     const pathData = pathDataByTrendName[activeTrend];

            //     const size = sizeByTrendName[activeTrend];

            //     const { path } = pathData;

            //     let color = [161, 13, 34, 255];

            //     if( showTrendCategories && hasTrendCategoriesAttribute) {
            //         color = ( attributes && attributes.trendType ) 
            //             ? TrendColor[attributes.trendType].values
            //             : [200,200,200,255];
            //     }

            //     // const strokeWidth = ( showTrendCategories && hasTrendCategoriesAttribute) ? 1 : 1;

            //     // console.log(color)

            //     // Create the CIM symbol:
            //     //  - set the size value
            //     //  - assign the generated path to the marker's geometry
            //     const symbol = new CIMSymbol({
            //         data: {
            //             type: 'CIMSymbolReference',
            //             symbol: {
            //                 type: "CIMPointSymbol",
            //                 symbolLayers: [
            //                     {
            //                         type: "CIMVectorMarker",
            //                         anchorPoint: {
            //                             x: 0,
            //                             y: -.5
            //                         },
            //                         anchorPointUnits: "Relative",
            //                         enable: true,
            //                         scaleSymbolsProportionally: false,
            //                         respectFrame: true,
            //                         size,
            //                         frame,
            //                         markerGraphics: [{
            //                             type: "CIMMarkerGraphic",
            //                             geometry: {
            //                                 paths: [path]
            //                             },
            //                             symbol: {
            //                                 type: "CIMLineSymbol",
            //                                 symbolLayers: [{
            //                                     type: "CIMSolidStroke",
            //                                     width: 1,
            //                                     color
            //                                 }]
            //                             }
            //                         }]
            //                     }
            //                 ]
            //             }
            //         }
            //     });

            //     const graphic = new Graphic({
            //         geometry: new Point({
            //             latitude: geometry.y,
            //             longitude: geometry.x
            //         }),
            //         symbol
            //     })

            //     return graphic;
            // });

            // trendLayer.addMany(graphics);

            const addGraphicsByChunk = (startIndex=0)=>{
                // console.log('doChunk', startIndex)
                const chunckNum = 800;
                const endIndex = startIndex + chunckNum < features.length? startIndex + chunckNum : features.length;
                const data:Covid19TrendData[] = features.slice(startIndex, endIndex);

                const graphics = data.map(feature=>{

                    const {
                        attributes,
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
    
                    const size = sizeByTrendName[activeTrend];
    
                    const { path } = pathData;
    
                    let color = [161, 13, 34, 255];
    
                    if( showTrendCategories && hasTrendCategoriesAttribute) {
                        color = ( attributes && attributes.trendType ) 
                            ? TrendColor[attributes.trendType].values
                            : [200,200,200,255];
                    }
    
                    // const strokeWidth = ( showTrendCategories && hasTrendCategoriesAttribute) ? 1 : 1;
    
                    // console.log(color)
    
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
                                        anchorPoint: {
                                            x: 0,
                                            y: -.5
                                        },
                                        anchorPointUnits: "Relative",
                                        enable: true,
                                        scaleSymbolsProportionally: false,
                                        respectFrame: true,
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
                                                    color
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

                if(startIndex + chunckNum < features.length){
                    renderDealy.current = setTimeout(()=>{
                        addGraphicsByChunk(startIndex + chunckNum)
                    }, 1);
                } else {
                    trendLayer.visible = true
                }
            }

            addGraphicsByChunk(0);

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

        if(trendLayer && data){

            trendLayer.removeAll();
            clearTimeout(renderDealy.current);
            // draw();

            if(isLayerInVisibleScale){
                draw();
            }
        }
    }, [ trendLayer, data, activeTrend, showTrendCategories ]);

    
    useEffect(()=>{
        if( 
            data &&
            isLayerInVisibleScale && 
            !trendLayer.graphics.length
        ){
            clearTimeout(renderDealy.current);
            draw();
        }

        if(isLayerInVisibleScaleOnChange){
            isLayerInVisibleScaleOnChange(isLayerInVisibleScale)
        }
        
    }, [ isLayerInVisibleScale ]);


    return null;
}

export default Covid19TrendLayer;
