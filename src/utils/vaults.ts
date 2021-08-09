import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { get, memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { Vault, Strategy } from '../types';
import VaultABI from '../contracts/Vault';
import { mapContractCalls } from './commonUtils';

const VAULT_VIEW_METHODS = [
    'apiVersion',
    'management',
    'governance',
    'guardian',
    'depositLimit',
    'totalAssets',
    'debtRatio',
    'totalDebt',
    'lastReport',
    'rewards',
    'symbol',
    'name',
    'managementFee',
    'performanceFee',
    'emergencyShutdown',
];

const _getVault = async (
    address: string,
    provider: Provider
): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }
    const multicall = new Multicall({ ethersProvider: provider });

    const vaultContract = new Contract(address, VaultABI as any, provider);
    const vaultCall = [
        {
            reference: address,
            contractAddress: address,
            abi: VaultABI,
            calls: VAULT_VIEW_METHODS.map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            })),
        },
    ];

    const results = await multicall.call(vaultCall);
    return {
        ...mapContractCalls(results.results[address]),
        address,
        strategies: [],
    };
};

export const getVault = memoize(_getVault);
