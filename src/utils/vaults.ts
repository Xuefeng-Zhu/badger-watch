import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { get, memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { Vault, Strategy } from '../types';
import VaultABI from '../contracts/Vault';
import { mapContractCalls } from './commonUtils';
import { getStrategies } from './strategies';

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
        strategies: await getVaultStrategies(address, provider),
    };
};

export const getVault = memoize(_getVault);

const getVaultStrategies = async (
    address: string,
    provider: Provider
): Promise<Strategy[]> => {
    const multicall = new Multicall({ ethersProvider: provider });
    const withdrawalQueueCalls = [];
    for (let i = 0; i < 10; i++) {
        withdrawalQueueCalls.push({
            reference: 'withdrawalQueue',
            methodName: 'withdrawalQueue',
            methodParameters: [i],
        });
    }

    const vaultCall = [
        {
            reference: address,
            contractAddress: address,
            abi: VaultABI,
            calls: withdrawalQueueCalls,
        },
    ];
    const results = await multicall.call(vaultCall);
    const strategyAddresses: string[] = [];
    results.results[address].callsReturnContext.forEach(({ returnValues }) => {
        if (returnValues[0] !== '0x0000000000000000000000000000000000000000') {
            strategyAddresses.push(returnValues[0]);
        }
    });

    return await getStrategies(strategyAddresses, provider);
};
