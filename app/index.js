import React from 'react';
import ReactDOM from 'react-dom';

import dogImage from './dog.jpg';
import styles from './styles.css';
const App = () => (
    <div className={styles.container}>
        <p>Hello world!</p>
        <p>Environment: { process.env.NODE_ENV }</p>
        <img src={dogImage} alt="It's a cute dog!" />
    </div>
);

ReactDOM.render(<App />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept();
}
