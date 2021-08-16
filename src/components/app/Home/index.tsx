import React from 'react';
import { useAsync } from 'react-use';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { VaultsList } from '../../common/VaultsList';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
import { useContractsContext } from '../../../providers/ContractsProvider';
import { getVaults } from '../../../utils/registry';

export const Home = () => {
    const { strategist } = useParams<any>();
    const { provider, badgerRegistry } = useWeb3Context();
    const { BadgerRegistry } = useContractsContext();

    const state = useAsync(async () => {
        let author = strategist;
        if (!author) {
            author = await BadgerRegistry?.governance();
        }

        if (!provider) {
            return;
        }

        return await getVaults(badgerRegistry, author, provider);
    }, [provider, strategist]);

    console.log(state);
    if (state.loading) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '100px',
                }}
            >
                <CircularProgress style={{ color: '#fff' }} />
                <Typography style={{ color: '#fff' }}>
                    Loading vaults..
                </Typography>
            </div>
        );
    }

    return <VaultsList items={state.value} />;
};
