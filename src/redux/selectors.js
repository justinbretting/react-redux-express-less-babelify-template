
// var reselect = require ('reselect');

// TODO: use reselect to memoize derived selectors

var rxupdate = require('react-addons-update')

/*
 Use this function to compute props that would be derived from store data
 */
module.exports = function(state) {
  return rxupdate(state, { ui: {

  }});
}
