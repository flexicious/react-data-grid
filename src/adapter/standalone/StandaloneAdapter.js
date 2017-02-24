
import { UIUtils, Constants, ToolbarAction, TypedObject, ClassFactory } from './LibraryImports'
import React from 'react';

import Modal from './Modal'
import ExportOptionsView from './ExportOptionsView'
import SaveSettingsPopup from './SaveSettingsPopup'
import SettingsPopup from './SettingsPopup'
import DatePicker from './DatePicker'

class StandAloneModal extends React.Component {
    constructor() {
        super();
        this.state = {
            open: true,
        };
        this.runAction = (action) => {
            if (action.closeDialog) {
                const result = action.callback(this.refs['child0']);
                if (result == true || result == undefined) {
                    this.setState({ open: false });
                }
            }
        }
        this.onClickOverlay = () => {
        }
    }


    render() {

        const children = React.Children.map(this.props.children, function (child, index) {
            return React.cloneElement(child, {
                ref: 'child' + (index++),
                key: 'child' + (index)

            });
        });


        const actions = this.props.actions.map(
            (action, index) => {
                return <ParameterizedFlatButton
                    key={"actionButton" + index}
                    label={action.name}
                    primary={true}
                    callback={this.runAction}
                    arg={action}
                    />;
            }
        );
        const customContentStyle = {
            width: this.props.width,
            height: this.props.height,
            maxWidth: 'none',
            maxHeight: 'none',
        };
        return (
            <div key="dialogDiv">
                <Modal
                    key="dialog"
                    onClickOverlay={this.onClickOverlay}
                    title={this.props.title}
                    actions={actions}
                    modal={this.props.modal}
                    visible={this.state.open}
                    contentStyle={customContentStyle}
                    className= {"flexiciousPopup"}
                    width={this.props.width}
                    height={this.props.height}
                    >
                    {children}
                </Modal>
            </div>
        );
    }
}

const ParameterizedFlatButton = ({label, callback, arg}) => {
    return <button
        onClick={() => { callback(arg) } }
        > {label}</button>;
}


/**
 * A utility class that maps utility functions from Flexicious into JQuery
 * @constructor
 * @namespace com.flexicious.adapters
 */
export default class StandaloneAdapter {
    getClassNames() { //for support of "is" keyword
        return ["TypedObject", this.typeName];
    }


    setupInputMask(input, options) {
        debugger;
    }
    showDialog(elem, parent, modal, w, h, title, actions) {

        return <StandAloneModal key="modalDialog" actions={actions} title={title} width={elem.props.style ? elem.props.style.width : "400"}
        height={elem.props.style ? elem.props.style.height : "300"}  modal={modal}>
            {elem}
        </StandAloneModal>;
    }

    createSettingsPopup() {
        return new ClassFactory(SettingsPopup)
    }
    createSaveSettingsPopup() {
        return new ClassFactory(SaveSettingsPopup)

    }
    createExportPopup() {
        return new ClassFactory(ExportOptionsView)

    }

    createDateTimePicker(dateFormat, dflt, hintText, ref, onChangeCallBack) {
        return <DatePicker hintText={hintText} ref={ref} defaultDate={dflt} container="inline" autoOk={true} key={ref} onChange={onChangeCallBack} />
    }
    getDateFromPicker(picker) {
        return picker.state.selectedDay;
    }


    showMessage(msg) {
        //alert(msg);//todo - make a better notification popup
        const toaster = new Android_Toast({ content: msg, position: "top" });
        toaster.show();
    }

    showTooltip(
        relativeTo,
        tooltip,
        dataContext,
        point,
        leftOffset,
        topOffset,
        offScreenMath,
        where,
        container,
        bounds) {


    }
    showToaster(
        message,
        title,
        type = "info",
        toasterPosition = "left",
        animationDuration = 1000,
        visibleDuration = 5000,
        moveAnimate = false,
        fadeAnimate = false) {
        const toaster = new Android_Toast({ content: message, position: toasterPosition });
        toaster.show();

    }
}

flexiciousNmsp.StandaloneAdapter = StandaloneAdapter; //add to name space
StandaloneAdapter.prototype.typeName = StandaloneAdapter.typeName = "StandaloneAdapter";//for quick 
flexiciousNmsp.UIUtils.adapter = new StandaloneAdapter();

/*
Copyright (c) 2013 Jad Joubran
https://github.com/jadjoubran/Android-Toast

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*
Android-Toast
(c) 2013-2014 Jad Joubran
*/

class Android_Toast {
    constructor(options) {
        let position;
        this.timeout_id = null;
        this.duration = 3000;
        this.content = '';
        this.position = 'bottom';

        if (!options || typeof options != 'object') {
            return false;
        }

        if (options.duration) {
            this.duration = parseFloat(options.duration);
        }
        if (options.content) {
            this.content = options.content;
        }

        if (options.position) {
            position = options.position.toLowerCase();
            if (position === 'top' || position === 'bottom') {
                this.position = position;
            } else {
                this.position = 'bottom';
            }
        }
        this.show();
    }

    show() {
        if (!this.content) {
            return false;
        }
        clearTimeout(this.timeout_id);

        const body = document.getElementsByTagName('body')[0];

        const previous_toast = document.getElementById('android_toast_container');
        if (previous_toast) {
            body.removeChild(previous_toast);
        }

        let classes = 'android_toast_fadein';
        if (this.position === 'top') {
            classes = 'android_toast_fadein android_toast_top';
        }

        const toast_container = document.createElement('div');
        toast_container.setAttribute('id', 'android_toast_container');
        toast_container.setAttribute('class', classes);
        body.appendChild(toast_container);

        const toast = document.createElement('div');
        toast.setAttribute('id', 'android_toast');
        toast.innerHTML = this.content;
        toast_container.appendChild(toast);

        this.timeout_id = setTimeout(this.hide, this.duration);
        return true;
    }

    hide() {
        const toast_container = document.getElementById('android_toast_container');

        if (!toast_container) {
            return false;
        }

        clearTimeout(this.timeout_id);

        toast_container.className += ' android_toast_fadeout';

        function remove_toast() {
            const toast_container = document.getElementById('android_toast_container');
            if (!toast_container) {
                return false;
            }
            toast_container.parentNode.removeChild(toast_container);
        }

        toast_container.addEventListener('webkitAnimationEnd', remove_toast);
        toast_container.addEventListener('animationEnd', remove_toast);
        toast_container.addEventListener('msAnimationEnd', remove_toast);
        toast_container.addEventListener('oAnimationEnd', remove_toast);

        return true;
    }
}
