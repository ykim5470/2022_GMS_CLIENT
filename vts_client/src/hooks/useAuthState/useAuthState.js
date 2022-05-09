import {useSelector} from 'react-redux'


/**
 * @type user state type 
 * @param user {*}
 */
const useAuthState = ()=>{
    const state = useSelector(state => state)
    const user = state.user
    console.log(user)
    if(user ==null){
        // throw new Error('Invalid User! Please re-login')
        return false
    }else{
        sessionStorage.setItem('token', JSON.stringify(user))
        return true
    }
}

export default useAuthState