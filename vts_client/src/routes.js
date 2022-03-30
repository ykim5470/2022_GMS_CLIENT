import { Route } from 'react-router-dom'
/**
 * WebRTC pages components
 * @interface Components
 */
import Landing from './components/webrtc/Landing'
import Stream from './components/webrtc/Stream'
import User from './components/webrtc/User'

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
    // exact: true,
    component: Stream,
    route: Route,
  },
  { path: '/user', name: 'User', exact: true, component: User, route: Route },
]

export { routes }
