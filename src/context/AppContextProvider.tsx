import React, { useEffect, useState, createContext } from 'react';

import axios from 'axios';

import {
    Covid19TrendDataQueryResponse,
    Covid19LatestNumbers,
    Covid19TrendData,
    Covid19TrendDataWithLatestNumbers,
} from 'covid19-trend-map';

import AppConfig from '../AppConfig';

import { getModifiedTime } from '../utils/getModifiedDate';

type AppContextProps = {
    lastModifiedDate: number;
    covid19USCountiesData: Covid19TrendDataQueryResponse;
    covid19USStatesData: Covid19TrendDataQueryResponse;
    covid19LatestNumbers: Covid19LatestNumbers;
    covid19TrendData4USCountiesWithLatestNumbers: Covid19TrendDataWithLatestNumbers[];
    covid19TrendData4USStatesWithLatestNumbers: Covid19TrendDataWithLatestNumbers[];
};

type AppContextProviderProps = {
    children: React.ReactNode;
};

export const AppContext = createContext<AppContextProps>(null);

const AppContextProvider: React.FC = ({
    children,
}: AppContextProviderProps) => {
    const [contextProps, setContextProps] = useState<AppContextProps>();

    const fetchData = async () => {
        const modified = getModifiedTime();

        try {
            const HostUrl = AppConfig['static-files-host'];
            const Url4CountiesJSON = `${HostUrl}${AppConfig['covid19-data-us-counties-json']}?modified=${modified}`;
            const Url4StatesJSON = `${HostUrl}${AppConfig['covid19-data-us-states-json']}?modified=${modified}`;
            const Url4LatestNumbers = `${HostUrl}${AppConfig['covid19-latest-numbers-json']}?modified=${modified}`;

            const queryResUSStates = await axios.get<
                Covid19TrendDataQueryResponse
            >(Url4StatesJSON);
            // setCovid19USStatesData(queryResUSStates.data);
            // console.log(queryResUSStates.data)

            const queryResUSCounties = await axios.get<
                Covid19TrendDataQueryResponse
            >(Url4CountiesJSON);
            // setCovid19USCountiesData(queryResUSCounties.data);
            // console.log(queryResUSCounties.data)

            const queryResLatestNumbers = await axios.get<Covid19LatestNumbers>(
                Url4LatestNumbers
            );
            // setCovid19LatestNumbers(queryResLatestNumbers.data);
            // dispatch(latestNumbersLoaded(queryResLatestNumbers.data));

            const addLatestNumbers2TrendData = (feature:Covid19TrendData):Covid19TrendDataWithLatestNumbers=>{
                const { FIPS } = feature.attributes;
            
                const {
                    Confirmed,
                    Deaths,
                    // NewCases,
                    NewCases100Days,
                    // NewDeaths,
                    NewDeaths100Days,
                    Population,
                } = queryResLatestNumbers.data[FIPS];
            
                return {
                    ...feature,
                    attributes: {
                        FIPS,
                        Confirmed,
                        Deaths,
                        ConfirmedPerCapita: Confirmed / Population,
                        DeathsPerCapita: Deaths / Population,
                        CaseFatalityRate:
                            Confirmed > 0 ? Deaths / Confirmed : 0,
                        CaseFatalityRate100Day: 
                            NewCases100Days > 0 ? NewDeaths100Days / NewCases100Days : 0
                    },
                };
            }

            const covid19TrendData4USCountiesWithLatestNumbers: Covid19TrendDataWithLatestNumbers[] = queryResUSCounties.data.features.map(addLatestNumbers2TrendData);

            const covid19TrendData4USStatesWithLatestNumbers: Covid19TrendDataWithLatestNumbers[] = queryResUSStates.data.features.map(addLatestNumbers2TrendData);

            setContextProps({
                covid19USCountiesData: queryResUSCounties.data,
                covid19USStatesData: queryResUSStates.data,
                covid19LatestNumbers: queryResLatestNumbers.data,
                covid19TrendData4USCountiesWithLatestNumbers,
                covid19TrendData4USStatesWithLatestNumbers,
                lastModifiedDate: queryResUSStates.data.modified
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppContext.Provider value={contextProps}>
            {contextProps ? children : null}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
