import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { VaultDescription } from './VaultDescription';
import Pie from '../Charts/Pie';
import BreadCrumbs from '../SingleStrategy/BreadCrumbs';
import { StrategistList } from '../StrategistList';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
import { getVault } from '../../../utils/vaults';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

interface ParamTypes {
    vaultId: string;
    version: string;
}
export const SingleVault = () => {
    const { provider } = useWeb3Context();
    const { vaultId, version } = useParams<ParamTypes>();
    const [value, setValue] = React.useState(0);
    const { value: vault, loading } = useAsync(async () => {
        if (!provider) {
            return;
        }

        return await getVault(vaultId, version, provider);
    }, [vaultId, version]);

    const useStyles = makeStyles((theme: Theme) => ({
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
            border: !vault?.configOK ? '5px solid #ff6c6c' : '',
        },
        crumbs: {
            maxWidth: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 15,
            marginTop: 15,
            color: '#fff',
        },
        text: {
            color: '#ffff',
            fontWeight: 'bolder',
        },
        row: {
            background: '#0a1d3f',
        },
        gridContainer: {
            flexGrow: 1,
        },

        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }));
    const classes = useStyles();
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    // let content =

    return (
        <React.Fragment>
            <ReactHelmet title={vault?.name} />
            <BreadCrumbs vaultId={vaultId} />
            <Card className={classes.root}>
                {loading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '100px',
                        }}
                    >
                        <CircularProgress />
                        <Typography>Loading vault..</Typography>
                    </div>
                ) : (
                    <React.Fragment>
                        <CardHeader
                            avatar={
                                <Avatar src={vault?.icon} aria-label="recipe" />
                            }
                            title={vault?.name}
                            subheader={
                                <EtherScanLink address={vault?.address} />
                            }
                        />

                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Details" {...a11yProps(0)} />
                            <Tab label="Allocation" {...a11yProps(1)} />
                            <Tab label="Strategies" {...a11yProps(2)} />
                        </Tabs>

                        <TabPanel value={value} index={0}>
                            {vault && <VaultDescription vault={vault} />}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {vault?.strategies.length && (
                                <div>
                                    <Pie vault={vault} />
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            {vault?.strategies.length && (
                                <div>
                                    <StrategistList
                                        vault={vault}
                                        dark={false}
                                    />
                                </div>
                            )}
                        </TabPanel>
                    </React.Fragment>
                )}
            </Card>
        </React.Fragment>
    );
};
