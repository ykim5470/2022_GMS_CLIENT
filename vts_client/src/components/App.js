import React, { useEffect } from 'react'
import { routes } from '../routes'
import { Routes } from 'react-router-dom'

const App = () => {
  return (
    <React.Fragment>
      {routes.map((route, index) => {
        return (
          <Routes key={index}>
            <route.route
              path={route.path}
              key={index}
              exact={route.exact}
              element={<route.component />}
            />
          </Routes>
        )
      })}
    </React.Fragment>
  )
}

export default App
