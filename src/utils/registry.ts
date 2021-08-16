import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { mapContractCalls } from './commonUtils';
import { getVault } from './vaults';
import BadgerRegistryABI from './ABI/BadgerRegistry.json';
import { Vault } from '../types';

export const getRegistryGov = async (
    address: string,
    provider: Provider
): Promise<Vault[]> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    const contract = new Contract(address, BadgerRegistryABI.abi, provider);
    return await contract.governance();
};

export const getVaults = async (
    address: string,
    author: string,
    provider: Provider
): Promise<Vault[]> => {
    return [
        ...(await getVaultsByVersion(address, author, 'v1', provider)),
        ...(await getVaultsByVersion(address, author, 'v2', provider)),
    ];
};

const getVaultsByVersion = async (
    address: string,
    author: string,
    version: string,
    provider: Provider
): Promise<Vault[]> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    const contract = new Contract(address, BadgerRegistryABI.abi, provider);
    const vaults = await contract.getVaults(version, author);

    return await Promise.all(
        vaults.map((vault: string) => getVault(vault, version, provider))
    );
};

const _getKeys = async (
    address: string,
    provider: Provider
): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    const multicall = new Multicall({ ethersProvider: provider });
    const registryCall = [
        {
            reference: address,
            contractAddress: address,
            abi: BadgerRegistryABI.abi,
            calls: [].map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            })),
        },
    ];

    const results = await multicall.call(registryCall);

    return {
        ...mapContractCalls(results.results[address]),
    };
};

export const getKeys = memoize(_getKeys);
