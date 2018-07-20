import {MuiThemeProvider} from "@material-ui/core/index.js";
import React, {Component} from 'react';
import {createMuiTheme}   from '@material-ui/core/styles';
import MainPanel          from './components/MainPanel'
import Tagbar             from "./components/Tagbar";
import red from '@material-ui/core/colors/red';

class App extends Component {


    render() {
        const theme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: red,
            },
        });

        return (
            <MuiThemeProvider theme={createMuiTheme(theme)}>
                <div id="app">
                    <Tagbar {...this.props} />
                    <MainPanel {...this.props} />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
