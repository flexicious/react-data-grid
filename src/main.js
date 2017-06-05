import React from 'react'
import ReactDOM from 'react-dom'
import Demo from './demo/Demo'
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('app')

let render = () => {

  ReactDOM.render(
    <Demo />,
    MOUNT_NODE
  )
}
// ========================================================
// Go!
// ========================================================
render()
