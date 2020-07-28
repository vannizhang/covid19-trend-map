import React, {
    useEffect,
    useState
} from 'react';

import axios from 'axios';

import MapView from '../MapView/MapView';
import Covid19TrendLayer from '../Covid19TrendLayer/Covid19TrendLayer';
import QueryTaskLayer from '../QueryTaskLayer/QueryTaskLayer';
import ControlPanel from '../ControlPanel/ControlPanel';
import ChartPanel from '../ChartPanel/ChartPanel';
import BottomPanel from '../BottomPanel/BottomPanel';
import SummaryInfoPanel from '../SummaryInfoPanel/SummaryInfoPanel';
import QueryTaskResultLayer from '../QueryTaskResultLayer/QueryTaskResultLayer'; 

import {
    Covid19TrendName,
    Covid19TrendData,
    Covid19CasesByTimeFeature,
    QueryLocation4Covid19TrendData
} from 'covid19-trend-map';

import IGraphic from 'esri/Graphic';

import AppConfig from '../../AppConfig';

import {
    urlFns, miscFns
} from 'helper-toolkit-ts';

import {
    fetchCovid19Data
} from '../../utils/queryCovid19Data';

import useMapCenterLocationFromUrl from '../../hooks/useMapLocationFromUrl';

const isMobile = miscFns.isMobileDevice();

const UrlSearchParams = urlFns.parseQuery();
// console.log(UrlSearchParams.trend)

const DefaultTrend:Covid19TrendName = UrlSearchParams.trend;

const App = () => {

    const { locationFromURL, saveLocationInURL } = useMapCenterLocationFromUrl();

    const [ activeTrend, setActiveTrend ] = useState<Covid19TrendName>(DefaultTrend || 'new-cases');

    const [ covid19USCountiesData, setCovid19USCountiesData ] = useState<Covid19TrendData[]>();

    const [ covid19USStatesData, setCovid19USStatesData ] = useState<Covid19TrendData[]>();

    const [ covid19CasesByTimeQueryResults, setCovid19CasesByTimeQueryResults ] = useState<Covid19CasesByTimeFeature[]>();

    // user can click map to select US State or County that will be used to query covid19 trend data
    const [ covid19CasesByTimeQueryLocation, setcovid19CasesByTimeQueryLocation ] = useState<QueryLocation4Covid19TrendData>();

    const fetchData = async()=>{

        try {
            const queryResUSCounties = await axios.get<Covid19TrendData[]>(AppConfig["covid19-data-us-counties-url"]);
            setCovid19USCountiesData(queryResUSCounties.data);
            // console.log(queryResUSCounties)

            const queryResUSStates = await axios.get<Covid19TrendData[]>(AppConfig["covid19-data-us-states-url"]);
            setCovid19USStatesData(queryResUSStates.data);
            // console.log(queryResUSStates)

        } catch(err){
            console.error(err);
        }

    };

    const countyOnSelect = async(countyFeature:IGraphic)=>{

        setcovid19CasesByTimeQueryLocation({
            graphic: countyFeature,
            locationName:  `${countyFeature.attributes['NAME']} CO, ${countyFeature.attributes['STATE_NAME']}`
        });

        const data = await fetchCovid19Data({
            countyFIPS: countyFeature.attributes['FIPS']
        });
        setCovid19CasesByTimeQueryResults(data);
    };

    const stateOnSelect = async(stateFeature:IGraphic)=>{

        const stateName = stateFeature.attributes['STATE_NAME'];

        setcovid19CasesByTimeQueryLocation({
            graphic: stateFeature,
            locationName: stateFeature.attributes['STATE_NAME']
        });

        const data = await fetchCovid19Data({
            stateName
        });
        setCovid19CasesByTimeQueryResults(data);
    };

    const resetQueryResults = ()=>{
        setCovid19CasesByTimeQueryResults(undefined);
        setcovid19CasesByTimeQueryLocation(undefined)
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <MapView 
                webmapId={AppConfig["webmap-id"]}
                initialMapCenterLocation={locationFromURL}
                onStationary={saveLocationInURL}
            >
                <QueryTaskResultLayer 
                    queryResult={covid19CasesByTimeQueryLocation ? covid19CasesByTimeQueryLocation.graphic : undefined}
                />

                <Covid19TrendLayer 
                    key='US-Counties'
                    features={covid19USCountiesData}
                    activeTrend={activeTrend}
                    size={20}
                    visibleScale={AppConfig["us-counties-layer-visible-scale"]}
                />

                <Covid19TrendLayer 
                    key='US-States'
                    features={covid19USStatesData}
                    activeTrend={activeTrend}
                    size={24}
                    visibleScale={AppConfig["us-states-layer-visible-scale"]}
                />

                <QueryTaskLayer 
                    key='query-4-US-Counties'
                    itemId={AppConfig["us-counties-feature-layer-item-id"]}
                    outFields={['FIPS', 'NAME', 'STATE_NAME']}
                    visibleScale={AppConfig["us-counties-layer-visible-scale"]}
                    onSelect={countyOnSelect}
                />

                <QueryTaskLayer 
                    key='query-4-US-States'
                    itemId={AppConfig["us-states-feature-layer-item-id"]}
                    outFields={['STATE_NAME']}
                    visibleScale={AppConfig["us-states-layer-visible-scale"]}
                    onSelect={stateOnSelect}
                />
            </MapView>

            <ControlPanel 
                isMobile={isMobile}
                activeTrend={activeTrend}
                activeTrendOnChange={setActiveTrend}
            />

            {
                covid19CasesByTimeQueryResults ? (
                    <BottomPanel>

                        <SummaryInfoPanel 
                            locationName={covid19CasesByTimeQueryLocation ? covid19CasesByTimeQueryLocation.locationName : undefined }
                            data={covid19CasesByTimeQueryResults}
                            isMobile={isMobile}
                            closeBtnOnClick={resetQueryResults}
                        />

                        <ChartPanel 
                            activeTrend={activeTrend}
                            data={covid19CasesByTimeQueryResults}
                        />
                    </BottomPanel>
                ) : null
            }


        </>
    )
}

export default App
