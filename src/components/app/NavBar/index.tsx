import { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
import { NETWORKS } from '../../../constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            fontFamily: 'open sans',
            FontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            fontColor: 'rgb(255, 255, 255)',

            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    })
);

export const NavBar = () => {
    const classes = useStyles();
    const { network, switchNetwork } = useWeb3Context();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="static"
            style={{ background: 'transparent', boxShadow: 'none' }}
        >
            <Toolbar>
                <Typography className={classes.title}>
                    <Link color="inherit" href="/">
                        Badger Watch
                    </Link>
                    <Link color="inherit" href="/keyvalues">
                        KeyValues
                    </Link>
                </Typography>

                <Button
                    aria-controls="network-selector"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={handleClick}
                >
                    {network.name}
                </Button>
                <Menu
                    id="network-selector"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {Object.values(NETWORKS).map((network: any) => (
                        <MenuItem
                            key={network.chainId}
                            onClick={() => {
                                switchNetwork(network.chainId);
                                handleClose();
                            }}
                        >
                            {network.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};
