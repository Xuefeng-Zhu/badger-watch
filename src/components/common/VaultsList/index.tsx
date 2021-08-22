import { FormEvent, useState } from 'react';
import { Container, TextField, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    items: Vault[] | undefined;
};

export const VaultsList = (props: VaultsListProps) => {
    const classes = useStyles();
    const { strategist } = useParams<any>();
    const history = useHistory();
    const [author, setAuthor] = useState(strategist);
    const { items = [] } = props;
    const groupByStage = !strategist;
    const vaultsByVersion = _.groupBy(items, 'version');
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        history.push(`/strategist/${author}`);
    };

    const renderVaults = (vaults: Vault[]) => {
        return vaults.map((vault: Vault, index: number) => (
            <VaultItemList vault={vault} key={index} />
        ));
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
            {_.map(vaultsByVersion, (vaults, version) => (
                <Accordion defaultExpanded key={version}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                    >
                        <Chip color="primary" label={version} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Container maxWidth="lg">
                            {groupByStage
                                ? _(vaults)
                                      .groupBy('status')
                                      .map((vs, status) => (
                                          <Accordion
                                              defaultExpanded
                                              key={status}
                                          >
                                              <AccordionSummary
                                                  expandIcon={
                                                      <ExpandMoreIcon />
                                                  }
                                                  aria-controls="panel1a-content"
                                              >
                                                  <Chip
                                                      color="secondary"
                                                      label={`Stage ${status}`}
                                                  />
                                              </AccordionSummary>
                                              <AccordionDetails>
                                                  <Container maxWidth="lg">
                                                      {renderVaults(vs)}
                                                  </Container>
                                              </AccordionDetails>
                                          </Accordion>
                                      ))
                                      .value()
                                : renderVaults(vaults)}
                        </Container>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};
