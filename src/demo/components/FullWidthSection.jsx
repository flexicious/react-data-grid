import React from 'react';
import ClearFix from 'material-ui/internal/ClearFix';
import spacing from 'material-ui/styles/spacing';
import { UIUtils } from './LibraryImports'

const desktopGutter = spacing.desktopGutter;

const FullWidthSection = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    contentStyle: React.PropTypes.object,
    contentType: React.PropTypes.string,
    style: React.PropTypes.object,
    useContent: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      useContent: false,
      contentType: 'div'
    };
  },

  getStyles() {
    return {
      root: {
        paddingTop: desktopGutter,
        paddingBottom: desktopGutter * 2,
        boxSizing: 'border-box'
      },
      content: {
        maxWidth: 1400,
        margin: '0 auto'
      }
    };
  },

  render() {
    const {
      style,
      useContent,
      contentType,
      contentStyle
    } = this.props;

    const styles = this.getStyles();

    let content;
    if (useContent) {
      content =
        React.createElement(
          contentType,
          {style: UIUtils.objectAssign(styles.content, contentStyle)},
          this.props.children
        );
    } else {
      content = this.props.children;
    }

    return (
      <ClearFix
        style={UIUtils.objectAssign(
          styles.root,
          style
          )}
      >
        {content}
      </ClearFix>
    );
  }
});

export default FullWidthSection;
