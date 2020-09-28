import {
    createSlice,
    createSelector,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    // StoreGetState
} from '../configureStore';

import { TooltipPosition, TooltipData } from '../../components/Tooltip/Tooltip';
import {
    // Covid19LatestNumbers,
    Covid19LatestNumbersFeature,
} from 'covid19-trend-map';

type MapState = {
    tooltipPosition: TooltipPosition;
    tooltipData: TooltipData;
    isStateLayerVisilbe: boolean;
    // latestNumbers: Covid19LatestNumbers;
};

type TooltipPositionChangedAction = {
    type: string;
    payload: TooltipPosition;
};

type TooltipDataChangedAction = {
    type: string;
    payload: TooltipData;
};

type IsStateLayerVisilbeToggledAction = {
    type: string;
    payload: boolean;
};

const slice = createSlice({
    name: 'map',
    initialState: {
        tooltipPosition: null,
        tooltipData: null,
        isStateLayerVisilbe: true,
    } as MapState,
    reducers: {
        tooltipPositionChanged: (
            state,
            action: TooltipPositionChangedAction
        ) => {
            state.tooltipPosition = action.payload;
        },
        tooltipDataChanged: (state, action: TooltipDataChangedAction) => {
            state.tooltipData = action.payload;
        },
        isStateLayerVisilbeToggled: (
            state,
            action: IsStateLayerVisilbeToggledAction
        ) => {
            state.isStateLayerVisilbe = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    tooltipDataChanged,
    tooltipPositionChanged,
    isStateLayerVisilbeToggled,
} = slice.actions;

export const updateTooltipData = (
    // locationName: string,
    data: Covid19LatestNumbersFeature
) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void => {
    let tooltipData: TooltipData;

    if (data) {
        const {
            Name,
            Confirmed,
            Deaths,
            NewCases,
            NewDeaths,
            Population,
            TrendType,
        } = data;

        tooltipData = {
            locationName: Name,
            confirmed: Confirmed,
            deaths: Deaths,
            newCasesPast7Days: NewCases,
            newDeathsPast7Days: NewDeaths || 0,
            population: Population,
            trendCategory: TrendType,
        };
    }

    dispatch(tooltipDataChanged(tooltipData));
};

// selectors
export const tooltipPositionSelector = createSelector(
    (state: RootState) => state.map.tooltipPosition,
    (tooltipPosition) => tooltipPosition
);

export const tooltipDataSelector = createSelector(
    (state: RootState) => state.map.tooltipData,
    (tooltipData) => tooltipData
);

export const isStateLayerVisilbeSelector = createSelector(
    (state: RootState) => state.map.isStateLayerVisilbe,
    (isStateLayerVisilbe) => isStateLayerVisilbe
);

export default reducer;
