import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { getVault, getVaults } from './vaults';
import BadgerRegistryABI from './ABI/BadgerRegistry.json';
import { Vault } from '../types';

const VAULT_VIEW_METHODS = ['symbol', 'name', 'controller', 'token'];

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

export const getProductionVaults = async (
    address: string,
    provider: Provider
): Promise<Vault[]> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    let vaults: Vault[] = [];
    const contract = new Contract(address, BadgerRegistryABI.abi, provider);
    const res = await contract.getProductionVaults();

    for (const { version, status, list } of res) {
        vaults = vaults.concat(
            await getVaults(list, version, provider, status)
        );
    }

    return vaults;
};

export const getVaultsByAuthor = async (
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

    return getVaults(vaults, version, provider);
};

export const getKeyValues = async (
    address: string,
    provider: Provider,
    keys: string[] = []
): Promise<{ [key: string]: string }> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    const contract = new Contract(address, BadgerRegistryABI.abi, provider);

    if (keys.length === 0) {
        for (let i = 0; i < 20; i++) {
            try {
                keys.push(await contract.keys(i));
            } catch {
                break;
            }
        }
    }

    const multicall = new Multicall({ ethersProvider: provider });
    const registryCall = [
        {
            reference: address,
            contractAddress: address,
            abi: BadgerRegistryABI.abi,
            calls: keys.map((key) => ({
                reference: 'get',
                methodName: 'get',
                methodParameters: [key],
            })),
        },
    ];
    const results = await multicall.call(registryCall);

    const keyValues: { [key: string]: string } = {};
    results.results[address].callsReturnContext.forEach(
        ({ methodParameters, returnValues }) => {
            keyValues[methodParameters[0]] = returnValues[0];
        }
    );

    return keyValues;
};
