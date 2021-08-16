import { createContext, ReactChild, ReactChildren, useContext } from 'react';

import { JsonRpcProvider } from '@ethersproject/providers';

import { getNetworkById } from '../constants';

const targetNetworkId = Number(process.env.NETWORK_ID) || 137;

interface Web3ContextProps {
    provider: JsonRpcProvider | undefined;
    networkId: number;
    badgerRegistry: string;
}

interface Web3ContextProviderProps {
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const Web3Context = createContext<Web3ContextProps>({
    provider: undefined,
    networkId: targetNetworkId,
    badgerRegistry: '',
});

export const Web3ContextProvider = ({
    children,
}: Web3ContextProviderProps): JSX.Element => {
    const network = getNetworkById(targetNetworkId);
    const provider = new JsonRpcProvider(network.rpcUrl);

    return (
        <Web3Context.Provider
            value={{
                provider,
                networkId: targetNetworkId,
                badgerRegistry: network.badgerRegistry,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3Context: () => Web3ContextProps = () =>
    useContext(Web3Context);
