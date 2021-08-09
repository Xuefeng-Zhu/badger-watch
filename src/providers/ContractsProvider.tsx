import { Contract } from 'ethers';
import { createContext, useContext, ReactChild, ReactChildren } from 'react';

import { Provider } from '@ethersproject/abstract-provider';

import useContractLoader from '../hooks/ContractLoader';
import { useWeb3Context } from './Web3ContextProvider';

interface ContractsContextProps {
    BadgerRegistry: Contract | undefined;
    contracts: { [key: string]: Contract };
}

export const ContractsContext = createContext<ContractsContextProps>({
    BadgerRegistry: undefined,
    contracts: {},
});

interface ContractsProviderProps {
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const ContractsProvider = ({ children }: ContractsProviderProps) => {
    const { provider, networkId } = useWeb3Context();
    const contracts = useContractLoader(networkId, provider as Provider);
    provider?.getBlockNumber().then(console.log);

    const { BadgerRegistry } = contracts || {};

    return (
        <ContractsContext.Provider
            value={{
                contracts,
                BadgerRegistry,
            }}
        >
            {children}
        </ContractsContext.Provider>
    );
};

export const useContractsContext: () => ContractsContextProps = () =>
    useContext(ContractsContext);
