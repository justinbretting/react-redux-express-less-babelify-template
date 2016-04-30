var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app.jsx');

var redux = require('redux');
var thunk = require('redux-thunk');
var Provider = require('react-redux').Provider;
var reducers = require('./redux/reducers');
var actions = require('./redux/actions');
var $ = require('jquery');
var _ = require('lodash');

var store = redux.createStore(
    reducers,
    redux.applyMiddleware(thunk) // lets us dispatch() complex functions for multi-step actions
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById("content")
)

