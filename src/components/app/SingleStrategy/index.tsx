import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

import BreadCrumbs from './BreadCrumbs';
import V1StrategyDetail from './V1StrategyDetail';

import { Strategy } from '../../../types';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';
import { getV1Strategy } from '../../../utils/strategies';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
interface ParamTypes {
    strategyId: string;
    vaultId: string;
    version: string;
}

export const SingleStrategy = () => {
    const { provider } = useWeb3Context();
    const { version, strategyId, vaultId } = useParams<ParamTypes>();

    const { value: strategy, loading } = useAsync(async () => {
        if (!provider) {
            return;
        }

        return await getV1Strategy(strategyId, provider);
    }, [strategyId, version]);

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%',
                },
                [theme.breakpoints.up('md')]: {
                    maxWidth: '80%',
                },
                [theme.breakpoints.up('lg')]: {
                    maxWidth: '80%',
                },

                marginLeft: 'auto',
                marginRight: 'auto',
                border: strategy?.emergencyExit ? '2px solid #ff6c6c' : '#fff',
            },
            demo1: {
                borderBottom: '1px solid #e8e8e8',
            },
        })
    );

    const classes = useStyles();

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <BreadCrumbs
                version={version}
                vaultId={vaultId}
                strategyId={strategyId}
            />

            {loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
                    <CircularProgress style={{ color: '#fff' }} />{' '}
                    <Typography style={{ color: '#fff' }}>
                        Loading strategy..
                    </Typography>
                </div>
            ) : (
                <MuiCard className={classes.root}>
                    <CardHeader
                        title={strategy?.name}
                        subheader={
                            <EtherScanLink address={strategy?.address} />
                        }
                    />
                    {strategy && <V1StrategyDetail strategy={strategy} />}
                </MuiCard>
            )}
        </React.Fragment>
    );
};
