import React, {
    useEffect
} from 'react'

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';

import {
    get7DaysAve
} from '../../utils/covid19-data';

type Props = {
    mapView?:IMapView;
}

const Covid19TrendLayer:React.FC<Props> = ({
    mapView
}) => {

    const init = async()=>{

        type Modules = [
            typeof IFeatureLayer, 
            typeof ICIMSymbol,
            typeof IGraphic
        ];

        try {
            const [ 
                FeatureLayer,
                CIMSymbol,
                Graphic
            ] = await (loadModules([
                'esri/layers/FeatureLayer',
                'esri/symbols/CIMSymbol',
                'esri/Graphic'
            ]) as Promise<Modules>);

            // Data for the chart symbols
            const data = new FeatureLayer({
                url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/JHU_last14/FeatureServer/0"
            });
      
            // Request for the data.
            const { features } = await data.queryFeatures({
                where: "1=1",
                maxAllowableOffset: 10000,
                returnGeometry: true,
                returnCentroid: true,
                outFields: ["*"],
                outSpatialReference: mapView.spatialReference
            });

            console.log(features);

            // Iterate over each feature
            for (const feature of features) {

                // Create a line path where:
                //   - x is the index of the day
                //   - y is the value
                const path = Array.from({
                    // The service shows the last 14 days
                    length: 14
                    },
                    (v, i) => [i, feature.attributes["Day_" + (i + 1)]]
                );
                // console.log(path)

                // Normalize the graph:

                //  - Grab the min/max values of y
                let ymax = path.reduce((prev, curr) => Math.max(prev, curr[1]), Number.NEGATIVE_INFINITY);
                let ymin = path.reduce((prev, curr) => Math.min(prev, curr[1]), Infinity);

                // If values are between 0 and 14, do nothing
                // 14 is the size of the graph in x (14 days)
                if ((ymax - ymin) < 14 && (ymax - ymin) > 0) {
                    ymax = 14;
                    ymin = 0;
                } else if ((ymax - ymin) >= 30) {
                    // normalize the graph otherwise
                    // by normalizing the y values
                    const ratio = 30 / (ymax - ymin)
                    path.forEach((p) => {
                        p[1] = p[1] * ratio;
                    });
                    ymax = ymax * ratio;
                    ymin = ymin * ratio
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
                                    size: ymax - ymin,
                                    frame: {
                                        xmin: 0,
                                        ymin,
                                        xmax: 14,
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
                                                color: [0, 0, 0, 125]
                                            }]
                                        }
                                    }]
                                }
                            ]
                        }
                    }
                });

                // const graphic = new Graphic({
                //     geometry: feature.geometry.centroid,
                //     symbol
                // })

                // // Add the symbol on the county's centroid
                // mapView.graphics.add(graphic);
            }

        } catch(err){   
            console.error(err);
        }
    };

    useEffect(()=>{
        get7DaysAve();
    }, [])

    useEffect(()=>{
        // if(mapView){
        //     init();
        // }
    }, [mapView]);

    return null;
}

export default Covid19TrendLayer
