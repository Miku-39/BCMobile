import { Platform } from 'react-native';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'remote-redux-devtools'
import { createLogger } from 'redux-logger'
import Immutable from 'immutable'

import rootReducer from './reducers'
import saga from './saga' 


const logger = createLogger({
    stateTransformer: (state) => {
        let newState = {};
    
        for (var i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }
  
        return newState;
    }
})

const sagaMiddleware = createSagaMiddleware()
//const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
const middlewares = [sagaMiddleware]//, logger]
const store = createStore(rootReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(saga)

export default store
