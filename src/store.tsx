// configureStore.ts
import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const store: Store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
