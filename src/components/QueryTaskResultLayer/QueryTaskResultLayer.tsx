import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { loadModules } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IGraphic from 'esri/Graphic';
import IPolygon from 'esri/geometry/Polygon';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import ISimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
// import { QueryLocationFeature } from 'covid19-trend-map';

import { queryLocationSelector } from '../../store/reducers/Covid19Data';

type Props = {
    // queryResult: QueryLocationFeature;
    mapView?: IMapView;
};

const QueryTaskResultLayer: React.FC<Props> = ({ mapView }) => {
    const queryResult = useSelector(queryLocationSelector);

    const [graphicLayer, setGraphicLayer] = useState<IGraphicsLayer>();

    const init = async () => {
        type Modules = [typeof IGraphicsLayer];

        try {
            const [GraphicsLayer] = await (loadModules([
                'esri/layers/GraphicsLayer',
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer();

            mapView.map.add(layer);

            setGraphicLayer(layer);
        } catch (err) {
            console.error(err);
        }
    };

    const showQueryResult = async () => {
        type Modules = [
            typeof IGraphic,
            typeof IPolygon,
            typeof ISimpleFillSymbol
        ];

        const [Graphic, Polygon, SimpleFillSymbol] = await (loadModules([
            'esri/Graphic',
            'esri/geometry/Polygon',
            'esri/symbols/SimpleFillSymbol',
        ]) as Promise<Modules>);

        const graphic = new Graphic({
            geometry: new Polygon(queryResult.graphic.geometry),
        });

        graphic.symbol = new SimpleFillSymbol({
            color: [0, 0, 0, 0],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: 'rgba(178,165,132,.7)',
                width: 1,
            },
        });

        graphicLayer.add(graphic);
    };

    useEffect(() => {
        if (mapView) {
            init();
        }
    }, [mapView]);

    useEffect(() => {
        if (graphicLayer) {
            graphicLayer.removeAll();

            if (queryResult && queryResult.graphic) {
                showQueryResult();
            }
        }
    }, [queryResult]);

    return null;
};

export default QueryTaskResultLayer;
