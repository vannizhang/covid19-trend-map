import { 
    configureStore, 
    getDefaultMiddleware 
} from '@reduxjs/toolkit';

import rootReducer from './reducers/rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    middleware:[ 
        ...getDefaultMiddleware<RootState>()
    ]
});

export type StoreDispatch = typeof store.dispatch;

export type StoreGetState = typeof store.getState;

export default store;
