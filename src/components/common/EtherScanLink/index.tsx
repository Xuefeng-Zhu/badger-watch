import { MouseEvent, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Tooltip from '@material-ui/core/Tooltip';
import { FileCopy } from '@material-ui/icons';
import { Link } from '@material-ui/core';
import { extractAddress } from '../../../utils/commonUtils';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';

type EtherScanLinkProps = {
    address?: string;
    transactionHash?: string;
    dark?: boolean | false;
    internalHref?: string;
};
const EtherScanLink = (props: EtherScanLinkProps) => {
    const { address, transactionHash, dark, internalHref } = props;
    const { network } = useWeb3Context();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeId);
    }, [copied]);

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            button: {
                margin: theme.spacing(1),
            },
            iconCall: {
                backgroundColor: '#fff',
                borderRadius: 3,
                padding: 2,
                boxShadow: '0 3px 6px 0 rgba(0,0,0,0.2)',
            },
            address: {
                fontSize: '14px',
                opacity: '0.7',
                color: dark ? '#fff' : 'black',
            },
            copiedText: {
                color: dark ? '#fff' : 'black',
            },
        })
    );
    const classes = useStyles();
    let value = '';
    let extractedValue = '';
    if (address) {
        value = address;
        extractedValue = extractAddress(address);
    }
    if (transactionHash) {
        value = transactionHash;
        extractedValue = extractAddress(transactionHash);
    }

    const maskedValue = (
        <Tooltip title={value} aria-label="Etherscan">
            <span>{extractedValue}</span>
        </Tooltip>
    );
    const onCopyToClipboard = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
    };
    const refLink = transactionHash
        ? `${network.explorer}/tx/${value}`
        : `${network.explorer}/address/${value}`;
    return (
        <span>
            <span className={classes.address}>
                {internalHref ? (
                    <Link color="inherit" href={internalHref}>
                        <Hidden smUp>{`${maskedValue}`}</Hidden>
                        <Hidden xsDown>{value}</Hidden>
                    </Link>
                ) : (
                    <>
                        <Hidden smUp>{maskedValue}</Hidden>
                        <Hidden xsDown>{value}</Hidden>
                    </>
                )}
            </span>
            <Tooltip title="Copy to clipboard" aria-label="Clipboard">
                <Button onClick={(e) => onCopyToClipboard(e)}>
                    <FileCopy fontSize="inherit" className={classes.iconCall} />
                    {copied ? (
                        <span className={classes.copiedText}> Copied</span>
                    ) : (
                        ''
                    )}
                </Button>
            </Tooltip>
            <Tooltip title="View on Etherscan" aria-label="Etherscan">
                <Button href={refLink} target="_blank">
                    <CallMadeIcon
                        fontSize="inherit"
                        className={classes.iconCall}
                    />
                </Button>
            </Tooltip>
        </span>
    );
};

export default EtherScanLink;
