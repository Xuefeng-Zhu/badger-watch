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

export const VaultDescription = (props: VaultDescriptionProps) => {
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
    const rewards = checkLabel(vault.rewards);
    const governance = checkLabel(vault.governance);
    const management = checkLabel(vault.management);
    const guardian = checkLabel(vault.guardian);
    const totalAsset = displayAmount(vault.totalAssets, 0) + ' ' + vault.symbol;
    const totalDebt = displayAmount(vault.totalDebt, 0) + ' ' + vault.symbol;
    const unallocated =
        displayAmount(sub(vault.totalAssets, vault.totalDebt), 0) +
        ' ' +
        vault.symbol;
    const vaultList = (
        <Typography variant="body2" color="textSecondary">
            Deposit limit :
            {displayAmount(vault.depositLimit, 0) + ' ' + vault.symbol}
        </Typography>
    );
    const managementFee = formatBPS(vault.managementFee);
    const performanceFee = formatBPS(vault.performanceFee);
    const debtUsage = formatBPS(vault.debtUsage);
    const debtRatio = formatBPS(vault.debtRatio);
    const lastReportText = toHumanDateText(vault.lastReport);
    const renderError = renderErrors();

    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            API Version:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {apiVersion}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{apiVersion}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Emergency shut down:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {emergencyShutDown}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{emergencyShutDown}</TableCell>
                        </MediaQuery>
                    </TableRow>
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
                            Management:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {management}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{management}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Guardian:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {guardian}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{guardian}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Rewards:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {rewards}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{rewards}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Assets:
                            <MediaQuery query="(max-device-width: 1224px)">
                                Total asset:
                                {totalAsset}
                                <ProgressBars vault={vault} />
                                {vaultList}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>
                                Total asset:
                                {totalAsset}
                                <ProgressBars vault={vault} />
                                {vaultList}
                            </TableCell>
                        </MediaQuery>
                    </TableRow>
                    {/* {vault && (
                        <TokenPrice
                            label="Total Assets (USD):"
                            token={vault.token}
                            amount={vault.totalAssets}
                        />
                    )} */}
                    <TableRow>
                        <TableCell>
                            Management fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {managementFee}%
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{managementFee}%</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Performance fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {performanceFee}%
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{performanceFee}%</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Time Since Last Report:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {lastReportText}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{lastReportText}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Total Debt:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {totalDebt}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{totalDebt}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            {`(Total Asset - Total Debt):`}
                            <MediaQuery query="(max-device-width: 1224px)">
                                {unallocated}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{unallocated}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Total Debt Ratio:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {debtRatio}%
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{debtRatio}%</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Debt Usage:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {debtUsage}%
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{debtUsage}%</TableCell>
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
