import { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { PostFetchQuotes } from '../../api/fetch'
import { userAuthenticate } from '../../redux/thunk'


const userAuthenticated = async() => {
    const authCheck =  await PostFetchQuotes({
     uri: `${process.env.REACT_APP_LOCAL_IP}/authenticate`,
     body: {userToken : sessionStorage.getItem('token')},
     msg: 'authenticate user'
   })
  
   return authCheck
  }  

const useAuthState = ()=>{
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    const user = state.user

    if(userAuthenticated().status == 200){
         dispatch(userAuthenticate(userAuthenticated.data))
         return true
    }

 
    // auth done user

    // else{
    //     console.log('토큰 강제 삭제하면 이거 발생하는데?')
    //      dispatch(userAuthenticate(null))
    // }
    console.log(user)

    if(user == null){
        return false
    }else{
        return true
    }
}

export default useAuthState