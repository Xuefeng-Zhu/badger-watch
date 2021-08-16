import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
    Home,
    SingleVault,
    NavBar,
    SingleStrategy,
    KeyValues,
} from './components/app';

class App extends React.Component {
    render() {
        return (
            <Router>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route
                        exact
                        path="/strategist/:strategist"
                        component={Home}
                    />

                    <Route
                        exact
                        path="/vault/:vaultId/:version"
                        component={SingleVault}
                    />
                    <Route
                        exact
                        path="/vault/:vaultId/strategy/:strategyId"
                        component={SingleStrategy}
                    />

                    <Route exact path="/keyvalues" component={KeyValues} />
                </Switch>
            </Router>
        );
    }
}

export default App;
