import React from 'react';
import { useAsync } from 'react-use';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { VaultsList } from '../../common/VaultsList';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
import { getKeyValues } from '../../../utils/registry';

export const KeyValues = () => {
    const { provider, badgerRegistry } = useWeb3Context();

    const state = useAsync(async () => {
        if (!provider) {
            return;
        }

        return await getKeyValues(badgerRegistry, provider);
    }, [provider]);

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

    const rows = Object.entries(state.value || {});

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row[0]}>
                            <TableCell>{row[0]}</TableCell>
                            <TableCell>{row[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
