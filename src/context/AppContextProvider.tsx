import React, {
    useEffect,
    useState,
    createContext
} from 'react';

import axios from 'axios';

import {
    Covid19TrendDataQueryResponse,
    Covid19LatestNumbers, 
    Covid19TrendData,
    Covid19TrendDataWithLatestNumbers
} from 'covid19-trend-map';

import AppConfig from '../AppConfig';

import { getModifiedTime } from '../utils/getModifiedDate';

type AppContextProps = {
    covid19USCountiesData: Covid19TrendDataQueryResponse;
    covid19USStatesData: Covid19TrendDataQueryResponse;
    covid19LatestNumbers: Covid19LatestNumbers;
    covid19TrendData4USCountiesWithLatestNumbers: Covid19TrendDataWithLatestNumbers[];
}

type AppContextProviderProps = {
    // children: React.ReactNode;
};

export const AppContext = createContext<AppContextProps>(null);

const AppContextProvider:React.FC<AppContextProviderProps> = ({ 
    children
})=>{

    const [ contextProps, setContextProps ] = useState<AppContextProps>();

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
            // console.log(queryResUSStates)

            const queryResUSCounties = await axios.get<
                Covid19TrendDataQueryResponse
            >(Url4CountiesJSON);
            // setCovid19USCountiesData(queryResUSCounties.data);
            // console.log(queryResUSCounties)

            const queryResLatestNumbers = await axios.get<Covid19LatestNumbers>(
                Url4LatestNumbers
            );
            // setCovid19LatestNumbers(queryResLatestNumbers.data);
            // dispatch(latestNumbersLoaded(queryResLatestNumbers.data));

            const covid19TrendData4USCountiesWithLatestNumbers:Covid19TrendDataWithLatestNumbers[] =  queryResUSCounties.data.features
            .map(feature=>{

                const { FIPS } = feature.attributes;
    
                const {
                    Confirmed,
                    Deaths,
                    NewCases,
                    NewDeaths,
                } = queryResLatestNumbers.data[FIPS];
    
                return {
                    ...feature,
                    attributes: {
                        FIPS,
                        Confirmed,
                        Deaths,
                        NewCases,
                        NewDeaths,
                    }
                }
            });

            setContextProps({
                covid19USCountiesData: queryResUSCounties.data,
                covid19USStatesData: queryResUSStates.data,
                covid19LatestNumbers: queryResLatestNumbers.data,
                covid19TrendData4USCountiesWithLatestNumbers
            })

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        fetchData();
    }, []);

    return (
        <AppContext.Provider value={contextProps}>
            { contextProps ? children : null }
        </AppContext.Provider>
    );
};

export default AppContextProvider;