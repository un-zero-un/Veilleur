import { MuiThemeProvider } from "material-ui";
import React, { Component } from 'react';
import darkBaseTheme        from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import LinkList             from './components/LinkList'
import Tagbar               from "./components/Tagbar";

class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div id="app">
                    <Tagbar {...this.props} />
                    <LinkList {...this.props} />
                </div>
            </MuiThemeProvider>
    )
        ;
    }
}

export default App;
