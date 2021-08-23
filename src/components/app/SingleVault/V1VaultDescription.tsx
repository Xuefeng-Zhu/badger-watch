import React from 'react';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import TokenPrice from '../../common/TokenPrice';
import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount, sub } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import ProgressBars from '../../common/ProgressBar';
import { Vault } from '../../../types';
import { toHumanDateText } from '../../../utils/dateUtils';

interface VaultDescriptionProps {
    vault: Vault;
}

export const V1VaultDescription = (props: VaultDescriptionProps) => {
    const { vault } = props;

    const renderErrors = () =>
        vault.configErrors &&
        vault.configErrors.map((message: string) => {
            return (
                <div key={message} style={{ color: '#ff6c6c' }}>
                    {message}
                </div>
            );
        });
    const apiVersion = vault.apiVersion;
    const emergencyShutDown = !vault.emergencyShutdown ? (
        <Chip
            label="ok"
            clickable
            style={{
                color: '#fff',
                backgroundColor: 'rgba(1,201,147,1)',
            }}
        />
    ) : (
        <Chip
            label="Emergency"
            clickable
            style={{
                color: '#fff',
                backgroundColor: '#ff6c6c',
            }}
        />
    );
    const governance = checkLabel(vault.governance);
    const keeper = checkLabel(vault.keeper);
    const controller = checkLabel(vault.controller);
    const balance = displayAmount(vault.balance, 0) + ' ' + vault.symbol;
    const available = displayAmount(vault.available, 0) + ' ' + vault.symbol;
    const totalSupply =
        displayAmount(vault.totalSupply, 0) + ' ' + vault.symbol;
    const renderError = renderErrors();

    console.log(vault);
    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Governance:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {governance}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{governance}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Keeper:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {keeper}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{keeper}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Controller:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {controller}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{controller}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Balance:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {balance}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{balance}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Available:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {available}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{available}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Total Supply:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {totalSupply}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{totalSupply}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    {vault && vault.configOK === false ? (
                        <TableRow
                            style={{
                                border: '2px solid #ff6c6c',
                            }}
                        >
                            <TableCell>
                                Config Warnings:
                                <MediaQuery query="(max-device-width: 1224px)">
                                    {renderError}
                                </MediaQuery>
                            </TableCell>
                            <MediaQuery query="(min-device-width: 1224px)">
                                <TableCell>{renderError}</TableCell>
                            </MediaQuery>
                        </TableRow>
                    ) : null}
                </TableHead>
            </Table>
        </React.Fragment>
    );
};
