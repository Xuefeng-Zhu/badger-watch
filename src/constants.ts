export interface NetworkInfo {
    name: string;
    chainId: number;
    badgerRegistry: string;
    rpcUrl: string;
    explorer: string;
}

export const NETWORKS: any = {
    1: {
        name: 'Ethereum',
        chainId: 1,
        badgerRegistry: '0xfda7eb6f8b7a9e9fcfd348042ae675d1d652454f',
        rpcUrl: 'https://api.mycryptoapi.com/eth',
        explorer: 'https://etherscan.io',
    },
    137: {
        name: 'Polygon',
        chainId: 137,
        badgerRegistry: '0xfda7eb6f8b7a9e9fcfd348042ae675d1d652454f',
        rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
        explorer: 'https://polygonscan.com',
    },
};

export const getNetworkById: (chainId: number) => NetworkInfo = (
    chainId: number
) => {
    return NETWORKS[chainId] || NETWORKS[1];
};
