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
    updateIsGridListVisibleInURLHashParams,
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

const activeViewModeDefaultVal:ViewMode = getDefaultValueFromHashParams( 'grid' ) && getDefaultValueFromHashParams('grid') === '1'
    ? 'grid'
    : 'map';

export type GridListSortField =
    | 'Confirmed'
    | 'Deaths'
    | 'ConfirmedPerCapita'
    | 'DeathsPerCapita'
    | 'CaseFatalityRate'
    | 'CaseFatalityRate100Day';

export type GridListSortOrder = 'ascending' | 'descending'

export type ViewMode = 'map' | 'grid';

type UIState = {
    isMobile: boolean;
    activeTrend: Covid19TrendName;
    isAboutModalOpen: boolean;
    isLoadingChartData: boolean;
    showTrendCategories: boolean;
    isNarrowSreen: boolean;
    activeViewMode: ViewMode;
    gridListSortField: GridListSortField;
    gridListSortOrder: GridListSortOrder;
    isOverviewMapVisible: boolean;
    // state abbreviation that will be used to highlight the path in overview map svg
    state2highlightInOverviewMap: string;
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

type GridListSortOrderUpdatedAction = {
    type: string;
    payload: GridListSortOrder;
};

type ActiveViewModeUpdatedAction = {
    type: string;
    payload: ViewMode;
};

type State2highlightInOverviewMapUpdatedAction = {
    type: string;
    payload: string;
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
        activeViewMode: activeViewModeDefaultVal,
        gridListSortField: 'CaseFatalityRate100Day',
        gridListSortOrder: 'descending',
        isOverviewMapVisible: false,
        state2highlightInOverviewMap: ''
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
        activeViewModeUpdated: (state, action: ActiveViewModeUpdatedAction) => {
            state.activeViewMode = action.payload;
        },
        gridListSortFieldUpdated: (
            state,
            action: GridListSortFieldUpdatedAction
        ) => {
            state.gridListSortField = action.payload;
        },
        gridListSortOrderUpdated: (state, action:GridListSortOrderUpdatedAction)=>{
            state.gridListSortOrder = action.payload;
        },
        isOverviewMapVisibleToggled: (state) => {
            state.isOverviewMapVisible = !state.isOverviewMapVisible;
        },
        state2highlightInOverviewMapUpdated: (state, action: State2highlightInOverviewMapUpdatedAction) => {
            state.state2highlightInOverviewMap = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    activeTrendUpdated,
    isAboutModalOpenToggled,
    isNarrowSreenChanged,
    showTrendCategoriesToggled,
    activeViewModeUpdated,
    gridListSortFieldUpdated,
    gridListSortOrderUpdated,
    isOverviewMapVisibleToggled,
    state2highlightInOverviewMapUpdated
} = slice.actions;

export const updateActiveMode = (viewMode:ViewMode) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void=>{
    dispatch(activeViewModeUpdated(viewMode));

    updateIsGridListVisibleInURLHashParams(viewMode === 'grid');
}

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

export const activeViewModeSelector = createSelector(
    (state: RootState) => state.UI.activeViewMode,
    (activeViewMode) => activeViewMode
);

export const gridListSortFieldSelector = createSelector(
    (state: RootState) => state.UI.gridListSortField,
    (gridListSortField) => gridListSortField
);

export const gridListSortOrderSelector = createSelector(
    (state: RootState) => state.UI.gridListSortOrder,
    (gridListSortOrder) => gridListSortOrder
);

export const isOverviewMapVisibleSelector = createSelector(
    (state: RootState) => state.UI.isOverviewMapVisible,
    (isOverviewMapVisible) => isOverviewMapVisible
);

export const state2highlightInOverviewMapSelector = createSelector(
    (state: RootState) => state.UI.state2highlightInOverviewMap,
    (state2highlightInOverviewMap) => state2highlightInOverviewMap
);

export default reducer;
