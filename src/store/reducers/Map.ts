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

import {
    TooltipPosition,
    TooltipData
} from '../../components/Tooltip/Tooltip'

type MapState = {
    tooltipPosition: TooltipPosition;
    tooltipData: TooltipData;
    isStateLayerVisilbe: boolean;
}

type TooltipPositionChangedAction = {
    type: string;
    payload: TooltipPosition;
}

type TooltipDataChangedAction = {
    type: string;
    payload: TooltipData;
}

type IsStateLayerVisilbeToggledAction = {
    type: string;
    payload: boolean;
}

const slice = createSlice({
    name: 'map',
    initialState: {
        tooltipPosition: null,
        tooltipData: null,
        isStateLayerVisilbe: true
    } as MapState,
    reducers: {
        tooltipPositionChanged: (state, action:TooltipPositionChangedAction)=>{
            state.tooltipPosition = action.payload;
        },
        tooltipDataChanged: (state, action:TooltipDataChangedAction)=>{
            state.tooltipData = action.payload;
        },
        isStateLayerVisilbeToggled: (state, action:IsStateLayerVisilbeToggledAction)=>{
            state.isStateLayerVisilbe = action.payload;
        }
    }
});

const {
    reducer,
} = slice;

export const {
    tooltipPositionChanged,
    tooltipDataChanged,
    isStateLayerVisilbeToggled
} = slice.actions;

// selectors
export const tooltipPositionSelector = createSelector(
    (state:RootState)=>state.map.tooltipPosition,
    (tooltipPosition)=>tooltipPosition
);

export const tooltipDataSelector = createSelector(
    (state:RootState)=>state.map.tooltipData,
    (tooltipData)=>tooltipData
);

export const isStateLayerVisilbeSelector = createSelector(
    (state:RootState)=>state.map.isStateLayerVisilbe,
    (isStateLayerVisilbe)=>isStateLayerVisilbe
);

export default reducer;
