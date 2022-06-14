import { Outlet, Route } from 'react-router-dom'
import { isMobile } from 'react-device-detect'


/**
 * WebRTC pages components
 * @interface Components
 */


/**
 * Layout
 */
import DesktopLayout from '../components/webrtc/layout/DesktopLayout'
import MobileLayout from '../components/webrtc/layout/MobileLayout'

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
import GuideRecordList from '../components/webrtc/guide/GuideRecordList'
/**
 * USER
 */
import User from '../components/webrtc/user/User'
import View from '../components/webrtc/user/View'


const Layout = isMobile ? MobileLayout : DesktopLayout

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
    component: GuideProfile,
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
    path: '/guide/recordList',
    name: 'GuideRecordList',
    exact: true,
    component: GuideRecordList,
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

// const guideRoutes = [
/**
 * WebRTC route components
 * @components
 */

// {
// path: '/',
// name: 'landing',
// element: 
// <>
//  session을 확인 (로그인 되어있는 지 아닌지)  
// session에 token id체크 및 server에 post (이 아이디가 있는지 없는 지 체크) 
// response가 200 + 704 가이드 로그인 
//  안 되어있으면 로그인 페이지로 redirect
//  로그인 권한에 따라 prefix를 설정
// </>
// children: [
//  path: 'login'
//  element: <Login/>
//  children: [
//  path: '/guide'
//  
// ]
// ]
// path: '/*'
// name: 'not found'
// element: <NotFound/>



// path: `/guide`,
// name: 'Layout',
// element: <><Layout/>guide<Login/><Outlet/></>,
// children: [
//   {
//     path: 'login',
//     name: 'Login',
//     element: <Login/>, 
//   },
//   {
//     path: 'broadcast/live/start',
//     name: 'LiveStartBanner',
//     element: <Landing/>,
//   },
//   {
//     path: 'broadcast/live/onair',
//     name: 'LiveStartOnAir',
//     element: <Stream/>
//   },
//   {
//     path: 'replay/list',
//     name: 'recordContentList',
//     element: <Stream/>
//   },
//   {
//     path: 'replay/upload',
//     name: 'recordContentUpload',
//     element: <Stream/>
//   },
//   {
//     path: 'mypage/edit',
//     name: 'GuideProfile',
//     element:  <GuideProfile/>,
//   },
//   {
//     path: 'manage/upload/list',
//     name: 'GuideRecordUpload',
//     element: <GuideContents/>,
//   },
//   {
//     path: 'manage/upload/edit',
//     name: 'GuideRecordEdit',
//     element: <GuideContents/>,
//   },
//   {
//     path: 'manage/upload/judgement',
//     name: 'GuideRecordJudgement',
//     element: <GuideContents/>,
//   },
//   {
//     path: 'user/upload/judgement',
//     name: 'GuideRecordJudgement',
//     element: <GuideContents/>,
//   },

// { path: 'user', name: 'User', element: <User/> },
// {
//   path: 'view/:id',
//   name: 'View',
//   element: <View/>,
// },
// ]
// },
// ]


const guideManagerRoutes = [
  {
    path: '/guideManager',
    name: 'guideManager',
    element: <><Layout />guideManager<Login /><Outlet /></>
  }
]

const userRoutes = [
  {
    path: '/',
    name: 'user',
    element: <><Layout />user<Outlet /></>,
    children: [
      {
        path: 'list',
        name: 'List',
        element: <User />
      },
      {
        path: 'view',
        name: 'View',
        element: <View />
      },
      {
        path: 'guide',
        name: 'GuideLogin',
        element: <Login />
      },
      {
        path: 'guideManager',
        name: 'GuideManagerLogin',
        element: <Login />
      }
    ]
  },
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   element: <>Not Found Page</>
  // }
]


export { guideManagerRoutes, userRoutes, routes }
