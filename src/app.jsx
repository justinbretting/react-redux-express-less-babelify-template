
var React = require('react');
var rxredux = require('react-redux');
var selectors = require('./redux/selectors');
var actions = require('./redux/actions');
var _ = require('lodash');
var cookies = require('cookies-js');

var ga = require('react-google-analytics');

var App = React.createClass({
    render: function() {
        return <div>
            App Div
            </div>
    }
})

module.exports = rxredux.connect(selectors)(App)

