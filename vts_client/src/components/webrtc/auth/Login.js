import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PostFetchQuotes } from '../../../api/fetch'
import { userAuthenticate } from '../../../redux/thunk'

import style from './Login.module.css'

const Login = () => {
    const email = useRef('')
    const password = useRef('')
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const redirect = () => {
        window.location.replace('https://enjoystreet.kr/store/testtest/111')
        return
    }

    const loginRequest = (event) => {
        try {
            PostFetchQuotes({
                uri: `${process.env.REACT_APP_LOCAL_IP}/guideLogin`,
                body: {
                    email: email.current,
                    password: password.current
                },
                msg: 'guide login request'
            }).then((response) => {
                console.log(response)
                if (response.status !== 200) {
                    alert('Login Failed')
                }
                else {
                    const userToken = response.data.token
                    console.log(userToken)
                    dispatch(userAuthenticate(userToken))
                    sessionStorage.setItem('token', userToken)
                    return navigate(`/guide1/landing`, { replace: true })
                }
            })
        } catch (err) {
            console.log(err)
        }
        event.preventDefault()
    }

    console.log('로그인 컴포 렌더 횟수')
    return (
        <div className={style.container}>
            <article className={style.login_form}>
                <div className='title-wrap'>Enjoy Street(가이드)</div>
                <form onSubmit={loginRequest}>
                    <label>
                        email
                        <input type='text' name='email' onChange={(e) => {
                            email.current = e.target.value
                        }} />
                    </label>
                    <br />
                    <label>
                        password
                        <input type='text' name='password' onChange={(e) => {
                            password.current = e.target.value
                        }} />
                    </label>
                    <br />
                    <input type='submit' value='로그인' />
                </form>

                <button onClick={redirect}>redirect</button>
            </article>
        </div>
    )
}

export default Login
