
// import {useRoutes} from 'react-router-dom'
// import { PostFetchQuotes } from '../../../api/fetch'
// import { guideRoutes, guideManagerRoutes, userRoutes } from '../../../route/routes' 


// // Beforehand render a proper components, app should identify a user is authenticated or not 
// const IsAuthenticated = () => {
//   // Auth Check; session
//   const initialSession = sessionStorage.getItem('token')

//   /**
//    * @returns {http response} 200: success, 40x: unAuthorized, 500: server error
//    */
//   const userAuthenticated = () => {
//     let userCheck = PostFetchQuotes({
//      uri: `${process.env.REACT_APP_LOCAL_IP}/authenticate`,
//      body: {userToken : initialSession},
//      msg: 'authenticate user'
//    }).then(result => {return result})

//    return userCheck
//   }  

//   // authState setup 
//   const authState = userAuthenticated()
//   console.log(authState)
//   const {status, nick, auth, nickName } = authState



//   // Classify Components by auth 
//   const guideComponents = useRoutes(guideRoutes)
//   const userComponents = useRoutes(userRoutes)
//   const guideManagerComponents = useRoutes(guideManagerRoutes)

//   console.log(auth)
//   console.log(status)
//   // Authenticated User 
//   if(status == 200){
//     console.log('로그인 했으면 일로 가야하는데')
//     // Render correspond children components
//     switch(auth){
//       case(121):
//         return guideComponents 
//       case(125):
//         return guideManagerComponents
//       default:
//         return guideComponents
//     }
//   }
//   // UnAuthenticated User
//   else{
//     console.log('로그인 안 했을 때 경로')
//     // Redirect to Login components
//     return userComponents
//   }
// }

// export default IsAuthenticated