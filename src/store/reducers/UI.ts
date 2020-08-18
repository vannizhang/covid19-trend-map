import { 
    createSlice,
    createSelector,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';
import { Covid19TrendName } from 'covid19-trend-map';

import {
    miscFns, urlFns
} from 'helper-toolkit-ts';

const NarrowScreenBreakPoint = 1020;
const SearchParamKeyShowTrendCategories = 'trendCategories'

const isMobile = miscFns.isMobileDevice();
const urlParams = urlFns.parseQuery();

const showTrendCategoriesDefaultVal = urlParams && urlParams[SearchParamKeyShowTrendCategories] 
    ? urlParams[SearchParamKeyShowTrendCategories] === '1' 
    : true;

type UIState = {
    isMobile: boolean;
    activeTrend: Covid19TrendName;
    isAboutModalOpen: boolean;
    isLoadingChartData: boolean;
    showTrendCategories: boolean;
    isNarrowSreen: boolean;
}

type ActiveTrendUpdatedAction = {
    type: string;
    payload: Covid19TrendName;
}

type BooleanPropChangedAction = {
    type: string;
    payload: boolean;
}

const slice = createSlice({
    name: 'map',
    initialState: {
        isMobile,
        activeTrend: 'new-cases',
        isAboutModalOpen: false,
        // isLoadingChartData: false,
        showTrendCategories: showTrendCategoriesDefaultVal,
        isNarrowSreen: window.outerWidth <= NarrowScreenBreakPoint
    } as UIState,
    reducers: {
        activeTrendUpdated: (state, action:ActiveTrendUpdatedAction)=>{
            state.activeTrend = action.payload;
        },
        isAboutModalOpenToggled: (state)=>{
            state.isAboutModalOpen = !state.isAboutModalOpen;
        }, 
        showTrendCategoriesToggled: (state)=>{
            state.showTrendCategories = !state.showTrendCategories;
        }, 
        isNarrowSreenChanged:(state, action:BooleanPropChangedAction)=>{
            state.isNarrowSreen = action.payload
        }
    }
});

const {
    reducer,
} = slice;

export const {
    activeTrendUpdated,
    isAboutModalOpenToggled,
    isNarrowSreenChanged,
    showTrendCategoriesToggled
} = slice.actions;

export const updateIsNarrowSreen = (windowOuterWidth:number)=> async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(isNarrowSreenChanged(windowOuterWidth <= NarrowScreenBreakPoint));
};

export const toggleShowTrendCategories = ()=> async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    const state = getState();
    const currentVal = state.UI.showTrendCategories;
    const newVal = !currentVal;
    dispatch(showTrendCategoriesToggled());

    urlFns.updateQueryParam({
        key: SearchParamKeyShowTrendCategories,
        value: newVal ? '1' : '0'
    })
};

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

export const isNarrowSreenSeletor = createSelector(
    (state:RootState)=>state.UI.isNarrowSreen,
    (isNarrowSreen)=>isNarrowSreen
);

export default reducer;