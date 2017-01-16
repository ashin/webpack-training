import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (<div>Hello world!</div>);
const rootElement = document.getElementById('app');

ReactDOM.render(<App />, rootElement);

if (module.hot) {
	module.hot.accept();
}
