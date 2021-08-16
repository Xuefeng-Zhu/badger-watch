export interface NetworkInfo {
    name: string;
    chainId: number;
    rpcUrl: string;
    badgerRegistry: string;
}

export const NETWORKS: any = {
    137: {
        name: 'polygon',
        chainId: 137,
        rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
        badgerRegistry: '0xfda7eb6f8b7a9e9fcfd348042ae675d1d652454f',
    },
};

export const getNetworkById: (chainId: number) => NetworkInfo = (
    chainId: number
) => {
    return NETWORKS[chainId] || NETWORKS[137];
};
