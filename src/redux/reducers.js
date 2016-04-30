
var redux = require('redux');

var ui = require('./reducers/ui');

module.exports = redux.combineReducers({
    ui: ui
})
