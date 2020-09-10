import { 
    createSlice,
    createSelector,
    createAsyncThunk
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

import {
    Covid19TrendDataQueryResponse,
    QueryLocation4Covid19TrendData,
    QueryLocationFeature,
} from 'covid19-trend-map';

import {
    fetchCovid19Data,
    fetchCovid19DataForNYCCounties,
    FIPSCodes4NYCCounties,
    FetchCovid19DataResponse
} from '../../utils/queryCovid19Data';

import IGraphic from 'esri/Graphic';

type State = {
    loading: boolean;
    data: FetchCovid19DataResponse;
    queryLocation: QueryLocation4Covid19TrendData;
}

// type QueryResultsUpdatedAction = {
//     type: string;
//     payload: FetchCovid19DataResponse;
// }

type QueryLocationUpdatedAction = {
    type: string;
    payload: QueryLocation4Covid19TrendData;
};

type FetchCovid19TimeSeriesDataParam = {
    countyFIPS?: string;
    stateName?: string;
    isNYCCounties?: boolean
}

type FetchCovid19TimeSeriesDataFullfilledAction = {
    type: string;
    payload: FetchCovid19DataResponse;
}

const fetchData = createAsyncThunk(
    'covid19TimeSeriesData/fetchData', 
    async({
        countyFIPS,
        stateName,
        isNYCCounties
    }:FetchCovid19TimeSeriesDataParam)=>{

        if(stateName){
            const data4SelectedState = await fetchCovid19Data({
                stateName
            });
            return data4SelectedState
        }

        if(isNYCCounties){
            const data4NYCCounty = await fetchCovid19DataForNYCCounties();
            return data4NYCCounty;
        }

        const data4SelectedCounty = await fetchCovid19Data({
            countyFIPS
        });
        return data4SelectedCounty;
    }
)

const slice = createSlice({
    name: 'covid19TimeSeriesData',
    initialState: {
        loading: false,
        data: null,
        queryLocation: null
    } as State,
    reducers:{
        queryResultsReset: (state)=>{
            state.data = null;
            state.queryLocation = null;
            state.loading = null;
        },
        queryLocationUpdated: (state, action:QueryLocationUpdatedAction)=>{
            state.queryLocation = action.payload;
        }
    },
    extraReducers: {
        [fetchData.pending.type]: (state)=>{
            state.loading = true;
            state.data = null;
        },
        [fetchData.fulfilled.type]: (state, action:FetchCovid19TimeSeriesDataFullfilledAction)=>{
            state.loading = false;
            state.data = action.payload;
        }
    }
});

const {
    reducer,
} = slice;

const {
    queryResultsReset,
    queryLocationUpdated,
} = slice.actions;

export const queryCountyData = (feature:QueryLocationFeature)=> async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    
    if(feature){ 

        const countyFIPS = feature.attributes['FIPS'];

        const isNYCCounties = FIPSCodes4NYCCounties.indexOf(countyFIPS) > -1;
    
        const locationName = isNYCCounties 
            ? 'NEW YORK, NEW YORK' 
            : `${feature.attributes['NAME']}, ${feature.attributes['STATE_NAME']}`;
    
        const queryLocation = {
            graphic: feature,
            locationName
        }
    
        dispatch(queryLocationUpdated(queryLocation));
    
        dispatch(fetchData({
            countyFIPS,
            isNYCCounties
        }));

    } else {
        dispatch(resetQueryData());
    }

};


export const queryStateData = (feature:QueryLocationFeature)=> async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    
    if(feature){
        const stateName = feature.attributes['STATE_NAME'];

        const queryLocation = {
            graphic: feature,
            locationName: stateName
        };
    
        dispatch(queryLocationUpdated(queryLocation));
    
        dispatch(fetchData({
            stateName
        }));

    } else {
        dispatch(resetQueryData());
    }

};

export const resetQueryData = ()=>async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(queryResultsReset());
}

export const covid19DataByLocationSelector = createSelector(
    (state:RootState)=>state.covid19Data.data,
    data=>data
)

export const queryLocationSelector = createSelector(
    (state:RootState)=>state.covid19Data.queryLocation,
    queryLocation=>queryLocation
)

export const covid19DataOnLoadingSelector = createSelector(
    (state:RootState)=>state.covid19Data.loading,
    loading=>loading
)

export default reducer;