import {
    PartialRootState
} from '../store/configureStore';

import {
    getDefaultValueFromHashParams
} from '../utils/UrlSearchParams';

import { Covid19TrendName } from 'covid19-trend-map';
import { initialUIState, UIState, ViewMode, NarrowScreenBreakPoint, GridListSortField } from '../store/reducers/UI';
import { miscFns } from 'helper-toolkit-ts';

const getPreloadedState = ():PartialRootState=>{
    return {
        UI: getPreloadedUIState()
    };
}

const getPreloadedUIState = ():UIState=>{
    
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

    const sortFieldDefaultVal = getDefaultValueFromHashParams('sort') as GridListSortField;

    return {
        ...initialUIState,
        isMobile,
        activeTrend: activeTrendDefaultVal,
        showTrendCategories: showTrendCategoriesDefaultVal,
        isNarrowSreen: window.outerWidth <= NarrowScreenBreakPoint,
        activeViewMode: activeViewModeDefaultVal,
        gridListSortField: sortFieldDefaultVal
    };
}

export default getPreloadedState