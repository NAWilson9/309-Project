var React = require('react');
var ReactDOM = require('react-dom');
var SemanticUI = require('semantic-ui-react');

var CHSS = React.createClass({
    render: function() {
        return React.createElement(SemanticUI.Dimmer, {active: true}, React.createElement(SemanticUI.Loader, {active: true}, 'Welcome to CHSS'));
    }
});

ReactDOM.render(React.createElement(CHSS), document.getElementById('react-app'));

