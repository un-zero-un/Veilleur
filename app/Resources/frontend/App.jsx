import {MuiThemeProvider} from "@material-ui/core";
import React, {Component} from 'react';
import {createMuiTheme}   from '@material-ui/core/styles';
import LinkList           from './components/LinkList'
import Tagbar             from "./components/Tagbar";

class App extends Component {


    render() {
        const theme = createMuiTheme({
            palette: {
                type: 'dark',
            },
        });

        return (
            <MuiThemeProvider theme={createMuiTheme(theme)}>
                <div id="app">
                    <Tagbar {...this.props} />
                    <LinkList {...this.props} />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
