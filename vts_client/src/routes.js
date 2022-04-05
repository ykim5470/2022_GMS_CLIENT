import { Route } from 'react-router-dom'
/**
 * WebRTC pages components
 * @interface Components
 */
import Landing from './components/webrtc/Landing'
import Stream from './components/webrtc/stream/Stream'
import User from './components/webrtc/user/User'
import View from './components/webrtc/user/View'

const routes = [
  /**
   * WebRTC route components
   * @components
   */
  {
    path: '/',
    name: 'Landing',
    exact: true,
    component: Landing,
    route: Route,
  },
  {
    path: '/stream/:id',
    name: 'Stream',
    exact: true,
    component: Stream,
    route: Route,
  },
  { path: '/user', name: 'User', component: User, route: Route },
  {
    path: '/user/:id',
    name: 'View',
    exact: true,
    component: View,
    route: Route,
  },
]

export { routes }
