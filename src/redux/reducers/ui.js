
var _ = require('lodash');
var rxupdate = require('react-addons-update');

module.exports = function(state, action) {
    if ( typeof state === 'undefined' ) {
        return {}
    }

    switch (action.type) {
        case 'ACTION':
            return rxupdate(state, {
                errors: {$push: [action.msg]}
            })
        default:
            return state
    }
}

