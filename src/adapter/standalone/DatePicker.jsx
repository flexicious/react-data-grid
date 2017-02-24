/*
The MIT License (MIT)

Copyright (c) 2014 Giampaolo Bellavite

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

import React, { Component } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';

import 'react-day-picker/lib/style.css';

const overlayStyle = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
};

export default class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
        this.state = {
            showOverlay: false,
            value: moment(this.props.defaultDate).format('L'),
            selectedDay: this.props.defaultDate,
        };

        this.input = null;
        this.daypicker = null;
        this.clickedInside = false;
        this.clickTimeout = null;
    }



    componentWillUnmount() {
        clearTimeout(this.clickTimeout);
    }


    handleContainerMouseDown() {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
    }

    handleInputFocus() {
        this.setState({
            showOverlay: true,
        });
    }

    handleInputBlur() {
        const showOverlay = this.clickedInside;

        this.setState({
            showOverlay,
        });

        // Force input's focus if blur event was caused by clicking on the calendar
        if (showOverlay) {
            this.input.focus();
        }
    }

    handleInputChange(e) {
        const { value } = e.target;
        const momentDay = moment(value, 'L', true);
        if (momentDay.isValid()) {
            this.setState({
                selectedDay: momentDay.toDate(),
                value,
            }, () => {
                this.daypicker.showMonth(this.state.selectedDay);
            });
        } else {
            this.setState({ value, selectedDay: null });
            if (this.props.onChange != null)
                this.props.onChange(e, value);
        }
    }


    handleDayClick(day) {
        this.setState({
            value: moment(day).format('L'),
            selectedDay: day,
            showOverlay: false,
        });
        if (this.props.onChange != null)
            this.props.onChange(null, moment(day).toDate());
        this.input.blur();
    }

    render() {
        return (
            <div onMouseDown={ this.handleContainerMouseDown } style={{ width: "100%", height: "100%" }}>
                <input
                    type="text"
                    ref={ (el) => { this.input = el; } }
                    placeholder={this.props.hintText}
                    style={{ width: "100%", height: "100%", marginTop: "-2.5px" }}
                    value={ this.state.value }
                    onChange={ this.handleInputChange }
                    onFocus={ this.handleInputFocus }
                    onBlur={ this.handleInputBlur }
                    />
                { this.state.showOverlay &&
                    <div style={ { position: 'relative' } }>
                        <div style={ overlayStyle }>
                            <DayPicker
                                ref={ (el) => { this.daypicker = el; } }
                                initialMonth={ this.state.selectedDay || undefined }
                                onDayClick={ this.handleDayClick }
                                selectedDays={ day => DateUtils.isSameDay(this.state.selectedDay, day) }
                                />
                        </div>
                    </div>
                }
            </div>
        );
    }
}