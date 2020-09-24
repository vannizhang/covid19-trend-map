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

export type GridListSortField = 'Confirmed' | 'Deaths' | 'ConfirmedPerCapita' | 'DeathsPerCapita' | 'CaseFatalityRate';

type UIState = {
    isMobile: boolean;
    activeTrend: Covid19TrendName;
    isAboutModalOpen: boolean;
    isLoadingChartData: boolean;
    showTrendCategories: boolean;
    isNarrowSreen: boolean;
    isGridListVisible: boolean;
    gridListSortField: GridListSortField;
};

type ActiveTrendUpdatedAction = {
    type: string;
    payload: Covid19TrendName;
};

type BooleanPropChangedAction = {
    type: string;
    payload: boolean;
};

type GridListSortFieldUpdatedAction = {
    type: string;
    payload: GridListSortField;
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
        isGridListVisible: true,
        gridListSortField: 'Confirmed'
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
        isGridListVisibleToggled: (state) => {
            state.isGridListVisible = !state.isGridListVisible;
        },
        gridListSortFieldUpdated: (state, action:GridListSortFieldUpdatedAction) => {
            state.gridListSortField = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    activeTrendUpdated,
    isAboutModalOpenToggled,
    isNarrowSreenChanged,
    showTrendCategoriesToggled,
    isGridListVisibleToggled,
    gridListSortFieldUpdated
} = slice.actions;

export const updateIsNarrowSreen = (windowOuterWidth: number) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void => {
    dispatch(isNarrowSreenChanged(windowOuterWidth <= NarrowScreenBreakPoint));
};

export const toggleShowTrendCategories = () => (
    dispatch: StoreDispatch,
    getState: StoreGetState
): void => {
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

export const isGridListVisibleSelector = createSelector(
    (state: RootState) => state.UI.isGridListVisible,
    (isGridListVisible) => isGridListVisible
);

export const gridListSortFieldSelector = createSelector(
    (state: RootState) => state.UI.gridListSortField,
    (gridListSortField) => gridListSortField
);

export default reducer;
