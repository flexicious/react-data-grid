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
const MOUNT_NODE = document.getElementById('root')

let render = () => {

  ReactDOM.render(
    <Demo />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

  }
}

// ========================================================
// Go!
// ========================================================
render()
