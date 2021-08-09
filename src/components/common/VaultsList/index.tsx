import { FormEvent, useState } from 'react';
import { Container, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { Vault } from '../../../types';
import { VaultItemList } from '../../app';
import _ from 'lodash';

const useStyles = makeStyles({
    searchInput: {
        width: '100%',
        margin: '15px',
        backgroundColor: 'white',
        alignContent: 'center',
    },
});

type VaultsListProps = {
    items: Vault[];
};

export const VaultsList = (props: VaultsListProps) => {
    const classes = useStyles();
    const { strategist } = useParams<any>();
    const history = useHistory();
    const [author, setAuthor] = useState(strategist);
    const { items = [] } = props;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        history.push(`/strategist/${author}`);
        console.log('test');
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <TextField
                    className={classes.searchInput}
                    variant="outlined"
                    type="search"
                    onChange={(e) => setAuthor(e.target.value)}
                    value={author}
                    placeholder="Search by strategist"
                />
            </form>
            {items.map((vault: Vault, index: number) => (
                <Container maxWidth="lg" key={index}>
                    <VaultItemList vault={vault} key={index} />
                </Container>
            ))}
        </Container>
    );
};
