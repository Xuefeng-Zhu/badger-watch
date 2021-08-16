import {
    createContext,
    ReactChild,
    ReactChildren,
    useContext,
    useState,
} from 'react';

import { JsonRpcProvider } from '@ethersproject/providers';

import { getNetworkById, NetworkInfo } from '../constants';

const targetNetworkId = Number(process.env.NETWORK_ID) || 137;

interface Web3ContextProps {
    provider: JsonRpcProvider | undefined;
    network: NetworkInfo;
    badgerRegistry: string;
    switchNetwork: (networkId: number) => void;
}

interface Web3ContextProviderProps {
    children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const Web3Context = createContext<Web3ContextProps>({
    provider: undefined,
    network: getNetworkById(targetNetworkId),
    badgerRegistry: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    switchNetwork: () => {},
});

export const Web3ContextProvider = ({
    children,
}: Web3ContextProviderProps): JSX.Element => {
    const [network, setNetwork] = useState(getNetworkById(targetNetworkId));
    const provider = new JsonRpcProvider(network.rpcUrl);

    const switchNetwork = (networkId: number) => {
        setNetwork(getNetworkById(networkId));
    };

    return (
        <Web3Context.Provider
            value={{
                provider,
                network,
                switchNetwork,
                badgerRegistry: network.badgerRegistry,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3Context: () => Web3ContextProps = () =>
    useContext(Web3Context);
