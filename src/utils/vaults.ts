import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { get, memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { Vault, Strategy } from '../types';
import { mapContractCalls } from './commonUtils';
import { getStrategies, getV1Strategy } from './strategies';
import VaultABI from './ABI/Vault.json';
import ControllerABI from './ABI/Controller.json';
import V1VaultABI from './ABI/V1Vault.json';

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

const V1_VAULT_VIEW_METHODS = [
    'governance',
    'keeper',
    'controller',
    'symbol',
    'name',
    'getPricePerFullShare',
    'balance',
    'available',
    'totalSupply',
    'token',
];

export const getVault = async (
    address: string,
    version: string,
    provider: Provider,
    vms: string[] = [],
    status = 0
): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }

    let vaultAbi: any = V1VaultABI.abi;
    let viewMethods = V1_VAULT_VIEW_METHODS;
    let strategies: Strategy[] = [];

    if (version === 'v2') {
        vaultAbi = VaultABI.abi;
        viewMethods = VAULT_VIEW_METHODS;
        strategies = await getVaultStrategies(address, provider);
    }

    if (vms.length) {
        viewMethods = vms;
    }

    const multicall = new Multicall({ ethersProvider: provider });
    const vaultCall = [
        {
            reference: address,
            contractAddress: address,
            abi: vaultAbi,
            calls: viewMethods.map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            })),
        },
    ];

    const results = await multicall.call(vaultCall);
    const mappedResult = mapContractCalls(results.results[address]);

    if (version === 'v1') {
        const controller = new Contract(
            mappedResult.controller,
            ControllerABI.abi,
            provider
        );
        const strategy = await controller.strategies(mappedResult.token);
        strategies = [await getV1Strategy(strategy, provider)];
    }

    return {
        ...mappedResult,
        address,
        strategies,
        version,
        status,
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
