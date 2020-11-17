import {
    createSlice,
    createSelector,
    // createAsyncThunk
    PayloadAction
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import { Covid19TrendName } from 'covid19-trend-map';

import {
    updateTrendCategoriesInURLHashParams,
    updateIsGridListVisibleInURLHashParams,
    updateSortFieldInURLHashParams
} from '../../utils/UrlSearchParams';

export const NarrowScreenBreakPoint = 1020;

export type GridListSortField =
    | 'Confirmed'
    | 'Deaths'
    | 'ConfirmedPerCapita'
    | 'DeathsPerCapita'
    | 'CaseFatalityRate'
    | 'CaseFatalityRate100Day';

export type GridListSortOrder = 'ascending' | 'descending'

export type ViewMode = 'map' | 'grid';

export type UIState = {
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

export const initialUIState = {
    isMobile: false,
    activeTrend: 'new-cases',
    isAboutModalOpen: false,
    // isLoadingChartData: false,
    showTrendCategories: true,
    isNarrowSreen: false,
    activeViewMode: 'map',
    gridListSortField: 'CaseFatalityRate100Day',
    gridListSortOrder: 'descending',
    isOverviewMapVisible: false,
    state2highlightInOverviewMap: ''
} as UIState;

const slice = createSlice({
    name: 'map',
    initialState: initialUIState,
    reducers: {
        activeTrendUpdated: (state, action: PayloadAction<Covid19TrendName>) => {
            state.activeTrend = action.payload;
        },
        isAboutModalOpenToggled: (state) => {
            state.isAboutModalOpen = !state.isAboutModalOpen;
        },
        showTrendCategoriesToggled: (state) => {
            state.showTrendCategories = !state.showTrendCategories;
        },
        isNarrowSreenChanged: (state, action: PayloadAction<boolean>) => {
            state.isNarrowSreen = action.payload;
        },
        activeViewModeUpdated: (state, action: PayloadAction<ViewMode>) => {
            state.activeViewMode = action.payload;
        },
        gridListSortFieldUpdated: (
            state,
            action: PayloadAction<GridListSortField>
        ) => {
            state.gridListSortField = action.payload;
        },
        gridListSortOrderUpdated: (state, action:PayloadAction<GridListSortOrder>)=>{
            state.gridListSortOrder = action.payload;
        },
        isOverviewMapVisibleToggled: (state) => {
            state.isOverviewMapVisible = !state.isOverviewMapVisible;
        },
        state2highlightInOverviewMapUpdated: (state, action: PayloadAction<string>) => {
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


export const updateGridListSortField = (sortField:GridListSortField) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void=>{
    dispatch(gridListSortFieldUpdated(sortField));

    updateSortFieldInURLHashParams(sortField);
}

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
