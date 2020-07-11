import React, {
    useEffect
} from 'react'

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';
import IPoint from 'esri/geometry/Point';

import {
    TrendData,
    Covid19USCountyTrendData
} from 'covid19-trend-map'

type Props = {
    activeTrendData: TrendData;
    data: Covid19USCountyTrendData[];
    mapView?:IMapView;
}

const Covid19TrendLayer:React.FC<Props> = ({
    activeTrendData,
    data,
    mapView
}) => {

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

            mapView.graphics.removeAll();

            // Iterate over each feature
            for (const feature of data) {

                const {
                    attributes,
                    geometry,
                    confirmed,
                    deaths,
                    newCases
                } = feature;

                const numbersByTrendName: { [key in TrendData]: number[] } = {
                    'confirmed': confirmed,
                    'death': deaths,
                    'new-cases': newCases
                };

                const values = numbersByTrendName[activeTrendData] || newCases;

                const path = values.map((val, idx)=>[ idx, val ]);
                const numOfDays = values.length;
                const size = 20;

                // Normalize the graph:
                //  - Grab the min/max values of y
                let ymax = path.reduce((prev, curr) => Math.max(prev, curr[1]), Number.NEGATIVE_INFINITY);
                let ymin = path.reduce((prev, curr) => Math.min(prev, curr[1]), Infinity);
                // console.log(ymin, ymax)

                // If values are between 0 and 14, do nothing
                // 14 is the size of the graph in x (14 days)
                if (
                    (ymax - ymin) < numOfDays && 
                    (ymax - ymin) > 0
                ){
                    ymax = numOfDays;
                    ymin = 0;
                } 
                else if ((ymax - ymin) >= numOfDays) {
                    // normalize the graph otherwise
                    // by normalizing the y values
                    const ratio = Math.floor((numOfDays / (ymax - ymin)) * 1000) / 1000;
                    // console.log(ratio)

                    path.forEach((p) => {
                        p[1] = p[1] * ratio;
                    });
                    
                    ymax = Math.ceil(ymax * ratio);
                    ymin = 0
                }

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
                                    frame: {
                                        xmin: 0,
                                        ymin,
                                        xmax: numOfDays,
                                        ymax
                                    },
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
                                                color: [0, 0, 0, 80]
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
                mapView.graphics.add(graphic);
            }

        } catch(err){   
            console.error(err);
        }
    };

    useEffect(()=>{
        if(mapView && data){
            draw();
        }
    }, [mapView, data, activeTrendData]);

    return null;
}

export default Covid19TrendLayer
