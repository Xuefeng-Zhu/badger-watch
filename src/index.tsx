import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ContextProvider } from './providers/Web3ContextProvider';
import { ContractsProvider } from './providers/ContractsProvider';

ReactDOM.render(
    <React.StrictMode>
        <Web3ContextProvider>
            <ContractsProvider>
                <App />
            </ContractsProvider>
        </Web3ContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
