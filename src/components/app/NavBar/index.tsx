import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

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
        },
        logoYearnWatch: {
            height: '64px',
        },
    })
);

export const NavBar = () => {
    const classes = useStyles();

    return (
        <AppBar
            position="static"
            style={{ background: 'transparent', boxShadow: 'none' }}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    href="/"
                >
                    Badger Watch
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
