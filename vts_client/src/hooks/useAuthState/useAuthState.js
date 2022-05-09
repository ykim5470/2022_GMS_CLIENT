import {useSelector} from 'react-redux'

const useAuthState = ()=>{
    const state = useSelector(state => state)
    const user = state.user
    if(user ==null){
        return false
    }else{
        sessionStorage.setItem('token', JSON.stringify(user))
        return true
    }
}

export default useAuthState