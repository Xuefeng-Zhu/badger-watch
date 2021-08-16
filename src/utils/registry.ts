import { Multicall } from 'ethereum-multicall';
import { utils, Contract } from 'ethers';
import { memoize } from 'lodash';
import { Provider } from '@ethersproject/abstract-provider';
import { mapContractCalls } from './commonUtils';
import { getVault } from './vaults';
import BadgerRegistryABI from './ABI/BadgerRegistry.json';
import { Vault } from '../types';
import { LiveTv } from '@material-ui/icons';

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

const _getKeyValues = async (
    address: string,
    provider: Provider
): Promise<{ [key: string]: string }> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid registry address');
    }

    const contract = new Contract(address, BadgerRegistryABI.abi, provider);
    const keys: string[] = [];
    for (let i = 0; i < 20; i++) {
        try {
            keys.push(await contract.keys(i));
        } catch {
            break;
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

export const getKeyValues = memoize(_getKeyValues);
