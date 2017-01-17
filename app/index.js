import React from 'react';
import ReactDOM from 'react-dom';

import dogImage from './dog.jpg';
import styles from './styles.css';

const App = () => (
    <div className={styles.container}>
        <p>Hello world!</p>
        <img src={dogImage} alt="It's a cute dog!" />
    </div>
);
const rootElement = document.getElementById('app');

ReactDOM.render(<App />, rootElement);

if (module.hot) {
	module.hot.accept();
}
