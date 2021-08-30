import { Link } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import EtherScanLink from '../../common/EtherScanLink';
import {
    extractText,
    displayAmount,
    formatBPS,
} from '../../../utils/commonUtils';
import { toHumanDateText } from '../../../utils/dateUtils';

import { Strategy, Vault } from '../../../types';
import Grid from '@material-ui/core/Grid';

type StrategistListProps = {
    vault: Vault;
    dark: boolean;
    expand?: boolean;
};

export const StrategistList = (props: StrategistListProps) => {
    const { vault } = props;
    const config = vault.configOK;
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {},
            rootGrid: {
                width: '100%',
            },
            address: {
                fontSize: '14px',
                opacity: '0.6',
                color: '#ffff',
            },
            text: {
                color: props.dark ? '#ffff' : 'black',
                fontFamily: 'Open Sans',
                lineHeight: '27px',
                fontSize: '18px',
                margin: 10,
            },
            iconCall: {
                backgroundColor: 'white',
                borderRadius: 3,
                padding: 2,
            },
            list: {
                background: 'transparent',
                border: 'none',
            },
            accordion: {
                background: props.dark ? (config ? '#040e20' : '#0552aa') : '',
                borderRadius: 5,
                margin: 10,
            },
            link: {
                color: props.dark ? '#ffff' : 'black',
                '&:hover': {
                    fontWeight: 600,
                },
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            },
            expandIcon: {
                color: props.dark ? '#ffff' : 'black',
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
            },
        })
    );
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body2" className={classes.text} component="p">
                Strategies
            </Typography>
            {vault.strategies &&
                vault.strategies.map((strategy: Strategy, index: number) => (
                    <Grid key={index} className={classes.rootGrid}>
                        <Grid item md={12} xs={12}>
                            <Grid
                                container
                                spacing={1}
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item md={4} xs={12}>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        <Link
                                            className={classes.link}
                                            to={`/vault/${vault.version}/${vault.address}/strategy/${strategy.address}`}
                                            rel="noreferrer"
                                        >
                                            <Hidden smUp>
                                                {strategy.name.length > 20
                                                    ? extractText(strategy.name)
                                                    : strategy.name}
                                            </Hidden>

                                            <Hidden xsDown>
                                                {strategy.name}
                                            </Hidden>
                                        </Link>
                                    </Typography>
                                </Grid>
                                <Hidden xsDown>
                                    {' '}
                                    <Grid item md={8} xs={6}>
                                        <EtherScanLink
                                            address={strategy.address}
                                            dark={props.dark}
                                        />
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
        </div>
    );
};
