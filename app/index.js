var React = require('react');
var ReactDOM = require('react-dom');

function App () {
    return React.createElement('div', null, 'Hello world');
}
var appComponent = React.createElement(Hello, {}, null);
var rootElement = document.getElementById('app');

ReactDOM.render(appComponent, rootElement);
