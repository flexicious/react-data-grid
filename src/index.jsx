
import { Constants, StyleDefaults } from 'flexicious-react-datagrid'
import Demo from './demo/Demo'
var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

window.React = React;
window.ReactDOM = ReactDOM;



Constants.IMAGE_PATH = "http://reactdatagrid.com/images";
StyleDefaults.defaults.imagesRoot = "http://reactdatagrid.com/images";

class App extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return <Demo />;

    }
}
ReactDOM.render(<App />, document.getElementById('app'));
