/**
 * The MIT License (MIT)

Copyright (c) 2015 Sergio Daniel Xalambrí

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */
import React from 'react';

const Modal = React.createClass({
  displayName: 'Modal',
  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
    onClickOverlay: React.PropTypes.func.isRequired,
    opacity: React.PropTypes.number,
    visible: React.PropTypes.bool,
    animation: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      className: 'Modal',
      opacity: 0.5,
    };
  },
  getInitialState() {
    return {
      styles: this.getStyles(),
      overlayVisible: this.props.visible,
      modalVisible: this.props.visible,
    };
  },
  componentWillReceiveProps(newProps) {
    let visible = {};
    if (newProps.visible) {
      visible = {
        overlayVisible: true,
        modalVisible: true,
      };
    } else {
      if (this.props.animation) {
        visible = {
          modalVisible: false,
        };
        setTimeout(()=> {
          this.setState({
            overlayVisible: false,
          });
        }, 300);
      } else {
        visible = {
          overlayVisible: false,
          modalVisible: false,
        };
      }
    }
    this.setState(visible);
  },
  getStyles() {
    return {
      overlay: {
        background: `rgba(0,0,0,${this.props.opacity})`,
        bottom: 0,
        display: 'block',
        left: 0,
        overflowY: 'auto',
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 1000,
      },
      wrapper: {
        bottom: 0,
        boxSizing: 'border-box',
        display: 'table',
        height: '100%',
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        top: 0,
        width: '100%',
      },
      subWrapper: {
        display: 'table-cell',
        verticalAlign: 'middle',
      },
      modal: {
        background: 'white',
        margin: '120 auto',
        position: 'relative',
        left: "50%",
        width: parseInt(this.props.width) + "px", 
        height: parseInt(this.props.height) + "px", 
        marginLeft:(0-(parseInt(this.props.width)/2)) + "px"
      },
    };
  },
  renderModal() {
    if (this.state.modalVisible) {
      return (
        <div style={this.state.styles.modal} className={this.props.className} onClick={this.stopPropagation}>
          {this.props.children}
          <div className={"bottomButtonBar"}>
            {this.props.actions}
          </div>
        </div>
      );
    }
    return null;
  },
  renderContentOverlay() {

    return (
      <div
        style={this.state.styles.subWrapper}
        onClick={this.props.onClickOverlay}
        >
        {this.renderModal()}
      </div>
    );
  },
  renderOverlay() {
    if (this.state.overlayVisible) {
      return (
        <div style={this.state.styles.overlay}>
          <div style={this.state.styles.wrapper}>
            {this.renderContentOverlay()}
          </div>
        </div>
      );
    }
    return null;
  },
  render() {

    return (
      <div>
        {this.renderOverlay()}
      </div>
    );
  },
  stopPropagation(e) {
    e.stopPropagation();
  },
});

export default Modal;