import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {createStore, applyMiddleware, compose}  from 'redux';
import LocalStorageMiddleware                   from "./middleware/LocalStorageMiddleware";
import registerServiceWorker                    from './registerServiceWorker';
import createSagaMiddleware                     from 'redux-saga';
import {createLogger}                           from 'redux-logger';
import {Provider}                               from "react-redux";
import ReactDOM                                 from 'react-dom';
import reducers                                 from './reducers/index';
import React                                    from 'react';
import vsaga                                    from './saga/index';
import App                                      from './App';

import "./assets/scss/Index.scss";

const sagaMiddleware = createSagaMiddleware();
let middleware       = [sagaMiddleware, LocalStorageMiddleware];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store            = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));

sagaMiddleware.run(vsaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/page/1/order/DESC/search/tags"/>}/>
                <Route path="/page/:page/order/:order/search/:search?/tags/:tag?" component={App}/>
                <Redirect to={"/"}/>
            </Switch>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));

registerServiceWorker();