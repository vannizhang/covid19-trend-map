import React, {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import MapView from '../MapView/MapView';
import Covid19TrendLayer from '../Covid19TrendLayer/Covid19TrendLayer';

import {
    TrendData,
    Covid19USCountyTrendData
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

    const [ covid19Data, setCovid19Data ] = useState<Covid19USCountyTrendData[]>();

    const fetchData = async()=>{
        const { data } = await axios.get<Covid19USCountyTrendData[]>(AppConfig["covid19-data-url"]);
        setCovid19Data(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MapView 
            webmapId={AppConfig["webmap-id"]}
        >
            <Covid19TrendLayer 
                data={covid19Data}
                activeTrendData={activeTrendData}
            />
        </MapView>
    )
}

export default App
