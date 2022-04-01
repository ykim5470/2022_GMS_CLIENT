import React from 'react'
import { routes } from '../routes'
import { Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

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
