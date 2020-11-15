import {
    createSlice,
    createSelector,
    // createAsyncThunk
    PayloadAction
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
            action: PayloadAction<TooltipPosition>
        ) => {
            state.tooltipPosition = action.payload;
        },
        tooltipDataChanged: (state, action: PayloadAction<TooltipData>) => {
            state.tooltipData = action.payload;
        },
        isStateLayerVisilbeToggled: (
            state,
            action: PayloadAction<boolean>
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
            Ranks
        } = data;

        tooltipData = {
            locationName: Name,
            confirmed: Confirmed,
            deaths: Deaths,
            newCasesPast7Days: NewCases,
            newDeathsPast7Days: NewDeaths || 0,
            population: Population,
            trendCategory: TrendType,
            ranks: {
                casesPerCapita: Ranks && Ranks[0] ? Ranks[0] : 0,
                deathsPerCapita: Ranks && Ranks[1] ? Ranks[1] : 0,
                caseFatalityRate: Ranks && Ranks[2] ? Ranks[2] : 0,
                caseFatalityRatePast100Day: Ranks && Ranks[3] ? Ranks[3] : 0,
            }
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
