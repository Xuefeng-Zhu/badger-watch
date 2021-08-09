/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useState } from 'react';
import _ from 'lodash';

import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import addresses from '../contracts/addresses';

export type Mutable<T> = {
    -readonly [k in keyof T]: T[k];
};

const loadContract = (
    networkId: number,
    contractName: string,
    provider: Provider
) => {
    const newContract = new Contract(
        _.get(
            addresses[networkId],
            contractName,
            '0x0000000000000000000000000000000000000000'
        ),
        require(`../contracts/${contractName}.ts`).default,
        provider
    );

    return newContract;
};

export default function useContractLoader(
    networkId: number,
    provider: Provider
): { [key: string]: Contract } {
    const [contracts, setContracts] = useState<{ [key: string]: Contract }>();
    useEffect(() => {
        async function loadContracts() {
            if (typeof provider !== 'undefined') {
                try {
                    const contractList = require('../contracts/contracts.ts')
                        .default;

                    const newContracts = contractList.reduce(
                        (accumulator: any, contractName: string) => {
                            accumulator[contractName] = loadContract(
                                networkId,
                                contractName,
                                provider
                            );
                            return accumulator;
                        },
                        {}
                    );
                    setContracts(newContracts);
                } catch (e) {
                    console.log('ERROR LOADING CONTRACTS!!', e);
                }
            }
        }
        loadContracts();
    }, [networkId, provider]);
    return contracts as { [key: string]: Contract };
}
