import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';
import { extractAddress } from '../../../utils/commonUtils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    })
);
type BreadCrumbsProps = {
    vaultId: string;
    strategyId?: string;
};
const BreadCrumbs = (props: BreadCrumbsProps) => {
    const { vaultId, strategyId } = props;
    const classes = useStyles();

    let strategyLevel;
    if (strategyId !== undefined) {
        strategyLevel = (
            <Link
                color="inherit"
                href={`/vault/${vaultId.toLowerCase()}/strategy/${strategyId.toLowerCase()}`}
            >
                <Typography className={classes.text}>
                    <Hidden smUp>{`${extractAddress(
                        strategyId.toLowerCase()
                    )}`}</Hidden>
                    <Hidden xsDown>{strategyId.toLowerCase()}</Hidden>
                </Typography>
            </Link>
        );
    }

    return (
        <MuiBreadcrumbs className={classes.crumbs}>
            <Link color="inherit" href="/">
                vaults
            </Link>
            <Link color="inherit" href={`/vault/${vaultId.toLowerCase()}/v2`}>
                <Hidden smUp>{`${extractAddress(
                    vaultId.toLowerCase()
                )}`}</Hidden>
                <Hidden xsDown>{vaultId.toLowerCase()}</Hidden>
            </Link>
            {strategyLevel}
        </MuiBreadcrumbs>
    );
};

export default BreadCrumbs;
