import React from 'react';

import MapView from '../MapView/MapView';
import Covid19TrendLayer from '../Covid19TrendLayer/Covid19TrendLayer';

const App = () => {
    return (
        <MapView 
            webmapId='5f3b7605b3364e7bb2416c93fae00995'
        >
            <Covid19TrendLayer />
        </MapView>
    )
}

export default App
