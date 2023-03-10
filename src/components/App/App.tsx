import React, { useContext, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import {
    updateTooltipData,
    tooltipDataChanged,
    tooltipPositionChanged,
    isStateLayerVisilbeToggled,
} from '../../store/reducers/Map';

import {
    updateIsNarrowSreen
} from '../../store/reducers/UI';

import {
    queryCountyData,
    queryStateData,
} from '../../store/reducers/Covid19Data';

import About from '../About/About';
import MapView from '../MapView/MapView';
import Tooltip from '../Tooltip/Tooltip';
import BottomPanel from '../BottomPanel/BottomPanel';
import ControlPanel from '../ControlPanel/ControlPanel';
import GridViewPanel from '../GridView/GridViewPanel';
import QueryTaskLayer from '../QueryTaskLayer/QueryTaskLayer';
import Covid19TrendLayer from '../Covid19TrendLayer/Covid19TrendLayer';
import QueryTaskResultLayer from '../QueryTaskResultLayer/QueryTaskResultLayer';

import {
    Covid19TrendDataQueryResponse,
    Covid19LatestNumbers,
} from 'covid19-trend-map';

import { AppContext } from '../../context/AppContextProvider';

import  {
    getDefaultValueFromHashParams
} from '../../utils/UrlSearchParams'

import AppConfig from '../../AppConfig';

import useWindowSize from '@rehooks/window-size';
import MessageModal from '../MessageModal/MessageModal';

type Props = {
    covid19USCountiesData: Covid19TrendDataQueryResponse;
    covid19USStatesData: Covid19TrendDataQueryResponse;
    covid19LatestNumbers: Covid19LatestNumbers;
};

const App: React.FC<Props> = ({
    covid19USCountiesData,
    covid19USStatesData,
    covid19LatestNumbers,
}: Props) => {
    const dispatch = useDispatch();

    const windowSize = useWindowSize();

    useEffect(() => {
        // query covid19 data to render detailed chart for state/county if FIPS code is found from the hash params
        const FIPS = getDefaultValueFromHashParams('q') as string;

        if(FIPS && covid19LatestNumbers[FIPS]){

            const { Name } = covid19LatestNumbers[FIPS];

            (FIPS.length === 2) 
                ? dispatch(queryStateData({
                    name: Name,
                    FIPS
                }))
                :  dispatch(queryCountyData({
                    name: Name,
                    FIPS,
                }))
        }

    }, []);

    useEffect(() => {
        // console.log(windowSize.outerWidth)
        dispatch(updateIsNarrowSreen(windowSize.outerWidth));
    }, [windowSize]);

    return (
        <>
            <MapView webmapId={AppConfig['webmap-id']}>
                <QueryTaskResultLayer />

                <Covid19TrendLayer
                    key="US-Counties"
                    data={covid19USCountiesData}
                    hasTrendCategoriesAttribute={true}
                    visibleScale={AppConfig['us-counties-layer-visible-scale']}
                />

                <Covid19TrendLayer
                    key="US-States"
                    data={covid19USStatesData}
                    visibleScale={AppConfig['us-states-layer-visible-scale']}
                    isLayerInVisibleScaleOnChange={(isVisible) => {
                        // setIsStateLayerVisible(isVisible);
                        dispatch(isStateLayerVisilbeToggled(isVisible));

                        // hide tooltip to prevent showing the data from different layer which is no longer visible
                        // setTooltipData(undefined);
                        dispatch(tooltipDataChanged(undefined));
                    }}
                />

                <QueryTaskLayer
                    key="query-4-US-Counties"
                    url={AppConfig['us-counties-feature-layer-item-url']}
                    outFields={['FIPS']}
                    visibleScale={AppConfig['us-counties-layer-visible-scale']}
                    onSelect={(feature) => {

                        const FIPS = feature
                            ? feature.attributes['FIPS']
                            : undefined;

                        const data = covid19LatestNumbers[FIPS];

                        dispatch(queryCountyData({
                            FIPS,
                            name: data.Name,
                            feature: feature ? feature.toJSON() : undefined,
                        }));
                    }}
                    pointerOnMove={(position) => {
                        dispatch(tooltipPositionChanged(position));
                    }}
                    featureOnHover={(feature) => {

                        const FIPS = feature
                            ? feature.attributes['FIPS']
                            : undefined;

                        const tooltipData = covid19LatestNumbers[FIPS];

                        dispatch(updateTooltipData(FIPS, tooltipData));
                    }}
                />

                <QueryTaskLayer
                    key="query-4-US-States"
                    url={AppConfig['us-states-feature-layer-item-url']}
                    outFields={['STATE_FIPS']}
                    visibleScale={AppConfig['us-states-layer-visible-scale']}
                    onSelect={(feature) => {
                        // const featureJSON = feature
                        //     ? feature.toJSON()
                        //     : undefined;

                        const FIPS = feature
                            ? feature.attributes['STATE_FIPS']
                            : undefined;

                        const data = covid19LatestNumbers[FIPS];

                        dispatch(queryStateData({
                            name: data.Name,
                            feature: feature ? feature.toJSON() : undefined,
                            FIPS
                        }));
                    }}
                    pointerOnMove={(position) => {
                        dispatch(tooltipPositionChanged(position));
                    }}
                    featureOnHover={(feature) => {

                        const FIPS = feature
                            ? feature.attributes['STATE_FIPS']
                            : undefined;

                        const tooltipData = covid19LatestNumbers[FIPS];

                        dispatch(updateTooltipData(FIPS, tooltipData));
                    }}
                />
            </MapView>

            <GridViewPanel />

            <ControlPanel />

            <BottomPanel />

            <Tooltip />

            <About
                ymax4confirmed={covid19USStatesData.frames.confirmed.ymax}
                ymax4deaths={covid19USStatesData.frames.deaths.ymax}
            />

            <MessageModal />
        </>
    );
};

const AppContainer = (): JSX.Element => {
    const {
        covid19USCountiesData,
        covid19USStatesData,
        covid19LatestNumbers,
    } = useContext(AppContext);

    return covid19USCountiesData &&
        covid19USStatesData &&
        covid19LatestNumbers ? (
        <App
            covid19USCountiesData={covid19USCountiesData}
            covid19USStatesData={covid19USStatesData}
            covid19LatestNumbers={covid19LatestNumbers}
        />
    ) : null;
};

export default AppContainer;
