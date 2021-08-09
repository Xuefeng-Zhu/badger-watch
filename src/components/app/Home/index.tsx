import React from 'react';
import { useAsync } from 'react-use';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { VaultsList } from '../../common/VaultsList';
import { useContractsContext } from '../../../providers/ContractsProvider';

export const Home = () => {
    const { strategist } = useParams<any>();
    const { BadgerRegistry } = useContractsContext();

    const state = useAsync(async () => {
        let author = strategist;
        if (!author) {
            author = await BadgerRegistry?.governance();
        }

        const response = await BadgerRegistry?.fromAuthorWithDetails(author);

        return response.map((vault: any) => {
            return {
                ...vault,
                address: vault[0],
                strategies: vault.strategies.map((strategy: any) => ({
                    ...strategy,
                    address: strategy[0],
                })),
            };
        });
    }, [BadgerRegistry, strategist]);

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
