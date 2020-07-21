import React, {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import MapView from '../MapView/MapView';
import Covid19TrendLayer from '../Covid19TrendLayer/Covid19TrendLayer';

import {
    TrendData,
    Covid19USCountyTrendData,
    Covid19USStateTrendData
} from 'covid19-trend-map'

import AppConfig from '../../AppConfig';

import {
    urlFns
} from 'helper-toolkit-ts';

const UrlSearchParams = urlFns.parseQuery();
// console.log(UrlSearchParams.trend)

const DefaultTrend:TrendData = UrlSearchParams.trend;

const App = () => {

    const [ activeTrendData, setActiveTrendData ] = useState<TrendData>(DefaultTrend || 'new-cases');

    // const [ showNormalizedData, setShowNormalizedData ] = useState<boolean>(true);

    const [ covid19USCountiesData, setCovid19USCountiesData ] = useState<Covid19USCountyTrendData[]>();

    const [ covid19USStatesData, setCovid19USStatesData ] = useState<Covid19USStateTrendData[]>();

    const fetchData = async()=>{

        try {
            const queryResUSCounties = await axios.get<Covid19USCountyTrendData[]>(AppConfig["covid19-data-us-counties-url"]);
            setCovid19USCountiesData(queryResUSCounties.data);
            // console.log(queryResUSCounties)

            const queryResUSStates = await axios.get<Covid19USStateTrendData[]>(AppConfig["covid19-data-us-states-url"]);
            setCovid19USStatesData(queryResUSStates.data);
            // console.log(queryResUSStates)

        } catch(err){
            console.error(err);
        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MapView 
            webmapId={AppConfig["webmap-id"]}
        >
            <Covid19TrendLayer 
                key='US-Counties'
                data={covid19USCountiesData}
                activeTrendData={activeTrendData}
                // showNormalizedData={showNormalizedData}
                size={18}
                visibleScale={AppConfig["us-counties-layer-visible-scale"]}
            />

            <Covid19TrendLayer 
                key='US-States'
                data={covid19USStatesData}
                activeTrendData={activeTrendData}
                // showNormalizedData={showNormalizedData}
                size={24}
                visibleScale={AppConfig["us-states-layer-visible-scale"]}
            />
        </MapView>
    )
}

export default App
