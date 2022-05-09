import { Route  } from 'react-router-dom'
/**
 * WebRTC pages components
 * @interface Components
 */

/**
 * Auth
 */
 import Login from '../components/webrtc/auth/Login'
 import Logout from '../components/webrtc/auth/Logout'

/**
 * GUIDE
 */
import Landing from '../components/webrtc/guide/Landing'
import GuideProfile from '../components/webrtc/guide/GuideProfile'
import GuideContents from '../components/webrtc/guide/GuideContents'
import Stream from '../components/webrtc/stream/Stream'
/**
 * USER
 */
import User from '../components/webrtc/user/User'
import View from '../components/webrtc/user/View'





const routes = [
  /**
   * WebRTC route components
   * @components
   */
  {
    path: '/login',
    name: 'Login',
    exact: true, 
    component: Login, 
    route: Route
  },
  {
    path: '/guide:id/landing',
    name: 'Landing',
    exact: true,
    component: Landing,
    route: Route,
  },
  {
    path: '/guide:id/profile',
    name: 'GuideProfile',
    exact: true,
    component:  GuideProfile,
    route: Route,
  },
  {
    path: '/guide:id/contents',
    name: 'GuideContents',
    exact: true,
    component: GuideContents,
    route: Route
  },
  {
    path: '/stream/:id',
    name: 'Stream',
    exact: true,
    component: Stream,
    route: Route,
  },
  { path: '/user', name: 'User', exact: true, component: User, route: Route },
  {
    path: '/view/:id',
    name: 'View',
    exact: true,
    component: View,
    route: Route,
  },
]

export { routes }
