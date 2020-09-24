import React from 'react';

import { 
    useSelector 
} from 'react-redux';
import { ThemeStyle } from '../../AppConfig';

import {
    activeViewModeSelector
} from '../../store/reducers/UI'

import GridList from './GridList';
import Header from './Header'

const GridViewPanel = () => {

    const activeViewMode = useSelector(activeViewModeSelector);
    
    return activeViewMode === 'grid' ? (
        <div
            style={{
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0,
                'backgroundColor': ThemeStyle["theme-color-khaki-bright"],
                'color': ThemeStyle["theme-color-red"],
            }}
        >
            <Header />
            <GridList />
        </div>
    ) : null;
}

export default GridViewPanel
