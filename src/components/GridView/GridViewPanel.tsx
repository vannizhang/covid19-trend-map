import React from 'react';

import { useSelector } from 'react-redux';
import { ThemeStyle } from '../../AppConfig';

import { activeViewModeSelector, isNarrowSreenSeletor } from '../../store/reducers/UI';

import GridList from './GridList';
import Header from './Header';
import OverviewMap from './OverviewMap';

const GridViewPanel: React.FC = () => {
    const activeViewMode = useSelector(activeViewModeSelector);
    const isNarrowScreen = useSelector(isNarrowSreenSeletor);

    return activeViewMode === 'grid' ? (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: ThemeStyle['theme-color-khaki-bright'],
                color: ThemeStyle['theme-color-red'],
                zIndex: isNarrowScreen ? 1 : 'unset'
            }}
        >
            <Header />
            <OverviewMap />
            <GridList />
        </div>
    ) : null;
};

export default GridViewPanel;
