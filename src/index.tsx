import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ContextProvider } from './providers/Web3ContextProvider';

ReactDOM.render(
    <React.StrictMode>
        <Web3ContextProvider>
            <App />
        </Web3ContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
