import React, { useState, useEffect, Suspense } from 'react'
import { guideManagerRoutes, userRoutes, routes } from './route/routes'
import { Routes, Router, Route, Navigate, useRoutes, useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { useDispatch, useSelector } from 'react-redux'
import { GetFetchQuotes, PostFetchQuotes } from './api/fetch'

import { userAuthenticate } from './redux/thunk'

import useAuthState from '../src/hooks/useAuthState/useAuthState'

import Login from './components/webrtc/auth/Login'
// import Splash from  './components/webrtc/loading/splash'


// const IsAuthenticated = React.lazy(()=> import('./components/webrtc/auth/Auth'))

import NavBar from './components/navigationBar/NavBar'
import SideBar from './components/navigationBar/SideBar'


const App = () => {
  // const state = useSelector(state => state)
  // const dispatch = useDispatch()
  // const [isAuth, setIsAuth] = useState(true)

  // const routing = useRoutes(guideRoutes)
  return (
    // <>{isAuth ? routing : <Login/>}</>
    <React.Fragment>
      {/* <NavBar />
      <SideBar /> */}
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

  // <Routes><Route path='/login' element={<Navigate replace to='/'/>}/></Routes>

  //  return <IsAuthenticated/>
  // return  (
  //   <Suspense fallback={<Splash/>}>
  //     <IsAuthenticated/>
  //   </Suspense>
  // )
}

export default App
