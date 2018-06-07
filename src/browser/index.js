import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import routes from '../shared/routes'
import store from '../shared/store'
import { CookiesProvider } from 'react-cookie'

hydrate(
  <Provider store={store}>
    <CookiesProvider>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </CookiesProvider>
  </Provider>,
  document.getElementById('app')
)
