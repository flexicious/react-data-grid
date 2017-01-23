require('normalize.css');
require('../styles/App.scss');
require('codemirror/lib/codemirror.css');

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/jsx/jsx');


import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CodeMirror from 'react-codemirror';
import FullWidthSection from './FullWidthSection'

const githubButton = (
  <FlatButton href="http://www.flexicious.com/Home/DownloadTrial">
    Request Trial
  </FlatButton>
);

const defaults = {
  markdown: '# Heading\n\nSome **bold** and _italic_ text\nBy [Jed Watson](https://github.com/JedWatson)',
  javascript: 'var component = {\n\tname: "react-codemirror",\n\tauthor: "Jed Watson",\n\trepo: "https://github.com/JedWatson/react-codemirror"\n};'
};
class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      code: defaults.javascript
    };
    this.toggleNavigation = this.toggleNavigation.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  componentWillMount() {
    this.setState({
      muiTheme: getMuiTheme()
    });
  }

  
  toggleNavigation(evt) {
    this.setState({ open: !this.state.open });
    if (evt.currentTarget.nodeName == "A") {
      const href = event.currentTarget.href;
      const partBefore = evt.currentTarget.href.substr(0, evt.currentTarget.href.lastIndexOf('/'));
      const partAfter = evt.currentTarget.href.substr(evt.currentTarget.href.lastIndexOf('/') + 1);
      this.loadSampleCode((partBefore.replace("#", "")) + "/samplecode/demo/components/" + partAfter + ".jsx", (resp) => {
        this.setState({ code: resp });
      })
    }
  }


  componentDidMount() {
    this.loadSampleCodeFromUrl(window.location.href.split('?')[0]);
  }
  loadSampleCodeFromUrl(href) {

    const partBefore = href.substr(0, href.lastIndexOf('/'));
    const partAfter = href.substr(href.lastIndexOf('/') + 1);
    this.loadSampleCode((partBefore.replace("#", "")) + "/samplecode/demo/components/" + partAfter + ".jsx", (resp) => {
      this.setState({ code: resp });
    });
  }
  loadSampleCode(url, callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  render() {
    var navTitleStyle = {
      marginLeft: '-8px'
    };

    /* PENDING
          <Link to="/selectionoptions" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Selection Options</MenuItem>
          </Link>

          <Link to="/filtercomboboxdataprovider" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Filter ComboBox Data Provider</MenuItem>
          </Link>

          <Link to="/localization" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Localization</MenuItem>
          </Link>

          <Link to="/oneitemopen" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>One Item Open</MenuItem>
          </Link>

          <Link to="/sortnumeric" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Sort Numeric</MenuItem>
          </Link>

          <Link to="/multiselectsetfiltervalue" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Multi Select Set Filter Value</MenuItem>
          </Link>

          <Link to="/variableheaderrowheight" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Variable Header Row Height</MenuItem>
          </Link>

          <Link to="/multiplegroupingmanual" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Multiple Grouping Manual</MenuItem>
          </Link>

          <Link to="/customfooter" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Custom Footer</MenuItem>
          </Link>

          <Link to="/columnwidthmode" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Column Width Mode</MenuItem>
          </Link>
*/

    return (
      <div id="main">
        <AppBar
          title="Flexicious React DataGrid Dashboard"
          onClick={this.toggleNavigation}
          iconElementRight={githubButton}
          />
        <Drawer
          open={this.state.open}
          docked={true}
          onRequestChange={(open) => this.setState({ open })}
          >
          <AppBar
            title="Samples"
            showMenuIconButton={false}
            titleStyle={navTitleStyle}
            />
          <Link to="/simple" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Simple</MenuItem>
          </Link>
          <Link to="/nested" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Nested</MenuItem>
          </Link>
          <Link to="/grouped" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Grouped</MenuItem>
          </Link>
          <Link to="/grouped2" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Grouped 2</MenuItem>
          </Link>
          <Link to="/outlook" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Outlook</MenuItem>
          </Link>

          <Link to="/itemrenderer" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Item Renderers</MenuItem>
          </Link>

          <Link to="/columnlockmode" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Column Lock Modes</MenuItem>
          </Link>

          <Link to="/partiallazyload" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Partial Lazy Load</MenuItem>
          </Link>
          <Link to="/fulllazyload" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Full Lazy Load</MenuItem>
          </Link>


          <Link to="/levelrenderer" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Level Renderer</MenuItem>
          </Link>

          <Link to="/programaticcellformatting" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Programatic Cell Formatting</MenuItem>
          </Link>

          <Link to="/itemeditor" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Editable Cells</MenuItem>
          </Link>


          <Link to="/dynamiccolumns" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Dynamic Columns</MenuItem>
          </Link>



          <Link to="/largedataset" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Large Dataset</MenuItem>
          </Link>

          <Link to="/xmldata" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>XmlData</MenuItem>
          </Link>


          <Link to="/xmlgroupeddata" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Xml Grouped Data</MenuItem>
          </Link>
          <Link to="/autoresizinggrid" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Auto Resizing Grid</MenuItem>
          </Link>


          <Link to="/selectionmodes" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Selection Modes</MenuItem>
          </Link>


          <Link to="/custommatchfiltercontrol" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Custom Match Filter Control</MenuItem>
          </Link>


          <Link to="/customtoolbar" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Custom Toolbar</MenuItem>
          </Link>

          <Link to="/largedynamicgrid" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Large Dynamic Grid</MenuItem>
          </Link>

          <Link to="/dynamiclevels" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>DynamicLevels</MenuItem>
          </Link>



          <Link to="/iconcolumns" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Icon Columns</MenuItem>
          </Link>

          <Link to="/errorhandling" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Error Handling</MenuItem>
          </Link>

          <Link to="/dynamicgrouping" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Dynamic Grouping</MenuItem>
          </Link>

          <Link to="/selectionui1" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Selection UI 1</MenuItem>
          </Link>

          <Link to="/selectionui2" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Selection UI 2</MenuItem>
          </Link>

          <Link to="/externalfilter" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>External Filter</MenuItem>
          </Link>

          <Link to="/changetrackingapi" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Change Tracking API</MenuItem>
          </Link>

          <Link to="/rowspancolspan" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Row Span Col Span</MenuItem>
          </Link>

          <Link to="/traderview" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Trader View</MenuItem>
          </Link>

          <Link to="/variablerowheight" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Variable Row Height</MenuItem>
          </Link>
          <Link to="/selectionoptions" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Selection Options</MenuItem>
          </Link>

          <Link to="/filtercomboboxdataprovider" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Filter ComboBox Data Provider</MenuItem>
          </Link>

          <Link to="/localization" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Localization</MenuItem>
          </Link>

          <Link to="/oneitemopen" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>One Item Open</MenuItem>
          </Link>

          <Link to="/sortnumeric" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Sort Numeric</MenuItem>
          </Link>

          <Link to="/multiselectsetfiltervalue" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Multi Select Set Filter Value</MenuItem>
          </Link>

          <Link to="/variableheaderrowheight" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Variable Header Row Height</MenuItem>
          </Link>

          <Link to="/multiplegroupingmanual" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Multiple Grouping Manual</MenuItem>
          </Link>

          <Link to="/customfooter" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Custom Footer</MenuItem>
          </Link>

          <Link to="/columnwidthmode" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Column Width Mode</MenuItem>
          </Link>
          <Link to="/dynamiccolumngroups" onClick={this.toggleNavigation} className="nav-link">
            <MenuItem>Dynamic Column Groups</MenuItem>
          </Link>
        </Drawer>
        <div className="page-content">
          {this.props.children}
          <h1 className='page-title'>Source Code</h1>
          <FullWidthSection useContent={true}>
            <CodeMirror
              value={this.state.code}
              options={{
                readOnly: false,
                mode: "jsx"
              }}
              />
          </FullWidthSection>
        </div>
      </div>
    );
  }
}

Layout.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

export default Layout;
