import React from 'react';
import spacing from 'material-ui/styles/spacing';
import transitions from 'material-ui/styles/transitions';
import typography from 'material-ui/styles/typography';
import { grey400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import UIUtils from '../../js/utils/UIUtils'
import withWidth, { MEDIUM, LARGE } from 'material-ui/utils/withWidth'

const Widget = React.createClass({

  propTypes: {
    firstChild: React.PropTypes.bool,
    heading: React.PropTypes.string,
    lastChild: React.PropTypes.bool,
    content: React.PropTypes.node,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps() {
    return {
      firstChild: false,
      lastChild: false
    };
  },

  getInitialState() {
    return {
      zDepth: 0
    };
  },

  getStyles() {
    const desktopGutter = spacing.desktopGutter;
    const desktopKeylineIncrement = spacing.desktopKeylineIncrement;
    const styles = {
      root: {
        transition: transitions.easeOut(),
        maxWidth: '400px',
        margin: `0 auto ${desktopGutter}px auto`
      },
      rootWhenMedium: {
        float: 'left',
        width: '33%',
        marginRight: 4,
        marginBottom: 0
      },
      heading: {
        fontSize: 20,
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        fontWeight: typography.fontWeightMedium,
        color: typography.textDarkBlack,
        backgroundColor: grey400,
        textAlign: 'center',
        margin: 0,
        padding: 0,
        lineHeight: `${desktopKeylineIncrement}px`
      },
      rootWhenLastChild: {
        marginBottom: 0
      },
      rootWhenMediumAndLastChild: {
        marginRight: 0,
        marginBottom: 0
      },
      rootWhenMediumAndFirstChild: {
        marginLeft: 0
      },
      content: {
        height: 300
      }
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.root = UIUtils.objectAssign(
        styles.root,
        styles.rootWhenMedium,
        this.props.firstChild && styles.rootWhenMediumAndFirstChild,
        this.props.lastChild && styles.rootWhenMediumAndLastChild
      );
    }

    return styles;
  },

  handleMouseEnter() {
    this.setState({
      zDepth: 4
    });
  },

  handleMouseLeave() {
    this.setState({
      zDepth: 0
    });
  },

  render() {
    const styles = this.getStyles();

    return (
      <Paper
        zDepth={this.state.zDepth}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={UIUtils.objectAssign(
          styles.root,
          this.props.lastChild && styles.rootWhenLastChild
        )}
      >
        <h3 style={styles.heading}>{this.props.heading}</h3>
        <div style={styles.content}>{this.props.content}</div>
      </Paper>
    );
  }

});

export default withWidth()(Widget);
