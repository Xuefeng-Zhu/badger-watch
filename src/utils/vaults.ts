import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { Vault, Strategy } from '../types';
import { mapContractCalls } from './commonUtils';
import { getStrategies, getV1Strategy, getV1Strategies } from './strategies';
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

const VAULT_LIST_VIEW_METHODS = ['symbol', 'name', 'token', 'controller'];

const FILTERED_VAULTS = new Set(['0x4b92d19c11435614CD49Af1b589001b7c08cD4D5']);

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

    // if (version === 'v1') {
    //     const controller = new Contract(
    //         mappedResult.controller,
    //         ControllerABI.abi,
    //         provider
    //     );
    //     const strategy = await controller.strategies(mappedResult.token);
    //     strategies = [await getV1Strategy(strategy, provider)];
    // }

    return {
        ...mappedResult,
        address,
        strategies,
        version,
        status,
    };
};

export const getVaults = async (
    addresses: string[],
    version: string,
    provider: Provider,
    status = 0
): Promise<Vault[]> => {
    const vaultAbi = V1VaultABI.abi;
    const viewMethods = VAULT_LIST_VIEW_METHODS;

    const multicall = new Multicall({ ethersProvider: provider });

    const vaultCalls = addresses
        .filter((address) => !FILTERED_VAULTS.has(address))
        .map((address) => {
            const calls = viewMethods.map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            }));
            return {
                reference: address,
                contractAddress: address,
                abi: vaultAbi,
                calls,
            };
        });

    const { results: vaultResults } = await multicall.call(vaultCalls);

    const vaults = Object.keys(vaultResults).map((address) => {
        return {
            ...mapContractCalls(vaultResults[address]),
            address,
            version,
            status,
        };
    });

    const controllerCalls = vaults.map((vault) => {
        return {
            reference: vault.token,
            contractAddress: vault.controller,
            abi: ControllerABI.abi,
            calls: [
                {
                    reference: 'strategies',
                    methodName: 'strategies',
                    methodParameters: [vault.token],
                },
            ],
        };
    });
    const { results: controllerResults } = await multicall.call(
        controllerCalls
    );

    const strategies = await getV1Strategies(
        vaults.map((vault) => {
            return mapContractCalls(controllerResults[vault.token]).strategies;
        }),
        provider
    );

    vaults.forEach((vault, index) => {
        vault.strategies = [strategies[index]];
    });

    return vaults;
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
