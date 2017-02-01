
var CHSS = React.createClass({
    render: function() {
        return React.createElement(semanticUIReact.Dimmer, {active: true}, React.createElement(semanticUIReact.Loader, {active: true}, 'Welcome to CHSS'));
    }
});

ReactDOM.render(React.createElement(CHSS), document.getElementById('react-app'));

