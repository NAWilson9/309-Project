var React = require('react');
var ReactDOM = require('react-dom');
var header = require('./header.jsx');
// import BoardSquare from './board_square.jsx';
import Board from './board.jsx';

ReactDOM.render(React.createElement(Board), document.getElementById('react-app'));

