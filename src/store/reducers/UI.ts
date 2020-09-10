import {
    createSlice,
    createSelector,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import { Covid19TrendName } from 'covid19-trend-map';

import { miscFns } from 'helper-toolkit-ts';

import {
    getDefaultValueFromHashParams,
    updateTrendCategoriesInURLHashParams,
} from '../../utils/UrlSearchParams';

const NarrowScreenBreakPoint = 1020;
const isMobile = miscFns.isMobileDevice();

const showTrendCategoriesDefaultVal = getDefaultValueFromHashParams(
    'trendCategories'
)
    ? getDefaultValueFromHashParams('trendCategories') === '1'
    : true;

const activeTrendDefaultVal = getDefaultValueFromHashParams(
    'trendType'
) as Covid19TrendName;

type UIState = {
    isMobile: boolean;
    activeTrend: Covid19TrendName;
    isAboutModalOpen: boolean;
    isLoadingChartData: boolean;
    showTrendCategories: boolean;
    isNarrowSreen: boolean;
};

type ActiveTrendUpdatedAction = {
    type: string;
    payload: Covid19TrendName;
};

type BooleanPropChangedAction = {
    type: string;
    payload: boolean;
};

const slice = createSlice({
    name: 'map',
    initialState: {
        isMobile,
        activeTrend: activeTrendDefaultVal,
        isAboutModalOpen: false,
        // isLoadingChartData: false,
        showTrendCategories: showTrendCategoriesDefaultVal,
        isNarrowSreen: window.outerWidth <= NarrowScreenBreakPoint,
    } as UIState,
    reducers: {
        activeTrendUpdated: (state, action: ActiveTrendUpdatedAction) => {
            state.activeTrend = action.payload;
        },
        isAboutModalOpenToggled: (state) => {
            state.isAboutModalOpen = !state.isAboutModalOpen;
        },
        showTrendCategoriesToggled: (state) => {
            state.showTrendCategories = !state.showTrendCategories;
        },
        isNarrowSreenChanged: (state, action: BooleanPropChangedAction) => {
            state.isNarrowSreen = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    activeTrendUpdated,
    isAboutModalOpenToggled,
    isNarrowSreenChanged,
    showTrendCategoriesToggled,
} = slice.actions;

export const updateIsNarrowSreen = (windowOuterWidth: number) => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
) => {
    dispatch(isNarrowSreenChanged(windowOuterWidth <= NarrowScreenBreakPoint));
};

export const toggleShowTrendCategories = () => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
) => {
    const state = getState();
    const currentVal = state.UI.showTrendCategories;
    const newVal = !currentVal;
    dispatch(showTrendCategoriesToggled());

    updateTrendCategoriesInURLHashParams(newVal);
};

// selectors
export const activeTrendSelector = createSelector(
    (state: RootState) => state.UI.activeTrend,
    (activeTrend) => activeTrend
);

export const isAboutModalOpenSelector = createSelector(
    (state: RootState) => state.UI.isAboutModalOpen,
    (isAboutModalOpen) => isAboutModalOpen
);

// export const isLoadingChartDataSelector = createSelector(
//     (state:RootState)=>state.UI.isLoadingChartData,
//     (isLoadingChartData)=>isLoadingChartData
// );

export const showTrendCategoriesSelector = createSelector(
    (state: RootState) => state.UI.showTrendCategories,
    (showTrendCategories) => showTrendCategories
);

export const isMobileSeletor = createSelector(
    (state: RootState) => state.UI.isMobile,
    (isMobile) => isMobile
);

export const isNarrowSreenSeletor = createSelector(
    (state: RootState) => state.UI.isNarrowSreen,
    (isNarrowSreen) => isNarrowSreen
);

export default reducer;
