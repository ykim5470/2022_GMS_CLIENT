import React, {useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { GetFetchQuotes, PostFetchQuotes } from '../../../api/fetch'
import {userAuthenticate} from '../../../redux/thunk'


const Login = () =>{
    const email = useRef('')
    const password = useRef('')
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const loginRequest = (event) =>{
    try{
        PostFetchQuotes({
            uri: `${process.env.REACT_APP_LOCAL_IP}/guideLogin`,
            body: {
                email: email.current,
                password: password.current
            },
            msg: 'guide login request'
        }).then((response) => {
            if(response === undefined){
                alert('Login Failed')
            }else{
                const userToken = response
                dispatch(userAuthenticate(userToken))
                const {id} = userToken.token
                return navigate(`/guide${id}/landing`)
            }
        })
    }catch(err){
        console.log(err)
    }
        event.preventDefault()
    }


return( 
    <article className='login-form'>
        <div className='title-wrap'>Enjoy Street(가이드)</div>
        <form onSubmit={loginRequest}>
            <label>
                email
                <input type='text' name='email' onChange={(e)=>{
                    email.current = e.target.value
                }}/>
            </label>
            <br/>          
            <label>
                password
                <input type='text' name='password' onChange={(e)=>{
                    password.current = e.target.value
                }}/>
            </label>
            <br/>
         <input type='submit' value='로그인' />
        </form>
    </article>
    )
}

export default Login