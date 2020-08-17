import { 
    createSlice,
    createSelector,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import {
    RootState,
    // StoreDispatch,
    // StoreGetState
} from '../configureStore';
import { Covid19TrendName } from 'covid19-trend-map';

import {
    miscFns
} from 'helper-toolkit-ts';

const isMobile = miscFns.isMobileDevice();

type UIState = {
    isMobile: boolean;
    activeTrend: Covid19TrendName;
    isAboutModalOpen: boolean;
    isLoadingChartData: boolean;
    showTrendCategories: boolean;
}

type ActiveTrendUpdatedAction = {
    type: string;
    payload: Covid19TrendName;
}

// type BooleanPropToggledAction = {
//     type: string;
//     payload: boolean;
// }

const slice = createSlice({
    name: 'map',
    initialState: {
        isMobile,
        activeTrend: 'new-cases',
        isAboutModalOpen: false,
        // isLoadingChartData: false,
        showTrendCategories: true
    } as UIState,
    reducers: {
        activeTrendUpdated: (state, action:ActiveTrendUpdatedAction)=>{
            state.activeTrend = action.payload;
        },
        isAboutModalOpenToggled: (state)=>{
            state.isAboutModalOpen = !state.isAboutModalOpen;
        }, 
        // isLoadingChartDataToggled: (state)=>{
        //     state.isLoadingChartData = !state.isLoadingChartData;
        // }, 
        showTrendCategoriesToggled: (state)=>{
            state.showTrendCategories = !state.showTrendCategories;
        }, 
    }
});

const {
    reducer,
} = slice;

export const {
    activeTrendUpdated,
    isAboutModalOpenToggled,
    // isLoadingChartDataToggled,
    showTrendCategoriesToggled
} = slice.actions;

// selectors
export const activeTrendSelector = createSelector(
    (state:RootState)=>state.UI.activeTrend,
    (activeTrend)=>activeTrend
);

export const isAboutModalOpenSelector = createSelector(
    (state:RootState)=>state.UI.isAboutModalOpen,
    (isAboutModalOpen)=>isAboutModalOpen
);

// export const isLoadingChartDataSelector = createSelector(
//     (state:RootState)=>state.UI.isLoadingChartData,
//     (isLoadingChartData)=>isLoadingChartData
// );

export const showTrendCategoriesSelector = createSelector(
    (state:RootState)=>state.UI.showTrendCategories,
    (showTrendCategories)=>showTrendCategories
);

export const isMobileSeletor = createSelector(
    (state:RootState)=>state.UI.isMobile,
    (isMobile)=>isMobile
);

export default reducer;