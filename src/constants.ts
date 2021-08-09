export interface NetworkInfo {
    name: string;
    chainId: number;
    rpcUrl: string;
}

export const NETWORKS: any = {
    137: {
        name: 'polygon',
        chainId: 137,
        rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    },
};

export const getNetworkById: (chainId: number) => NetworkInfo = (
    chainId: number
) => {
    return NETWORKS[chainId] || NETWORKS[137];
};
