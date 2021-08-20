import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { get, memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { Vault, Strategy } from '../types';
import { mapContractCalls } from './commonUtils';
import { getStrategies } from './strategies';
import VaultABI from './ABI/Vault.json';

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

const VAULT_V1_VIEW_METHODS = ['symbol', 'name'];

export const getVault = async (
    address: string,
    version = 'v2',
    provider: Provider
): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }

    let viewMethods = VAULT_V1_VIEW_METHODS;
    let strategies: Strategy[] = [];
    if (version === 'v2') {
        viewMethods = VAULT_VIEW_METHODS;
        strategies = await getVaultStrategies(address, provider);
    }

    const multicall = new Multicall({ ethersProvider: provider });
    const vaultCall = [
        {
            reference: address,
            contractAddress: address,
            abi: VaultABI.abi,
            calls: viewMethods.map((method) => ({
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
        strategies,
        version,
    };
};

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
            abi: VaultABI.abi,
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
