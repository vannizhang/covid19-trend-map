import {
    PartialRootState
} from '../store/configureStore';

import {
    getDefaultValueFromHashParams
} from '../utils/UrlSearchParams';

import { Covid19TrendName } from 'covid19-trend-map';
import { ViewMode, NarrowScreenBreakPoint } from '../store/reducers/UI';
import { miscFns } from 'helper-toolkit-ts';

const getPreloadedState = ():PartialRootState=>{

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

    return {
        UI: {
            isMobile,
            activeTrend: activeTrendDefaultVal,
            showTrendCategories: showTrendCategoriesDefaultVal,
            isNarrowSreen: window.outerWidth <= NarrowScreenBreakPoint,
            activeViewMode: activeViewModeDefaultVal,
        }
    };
}

export default getPreloadedState