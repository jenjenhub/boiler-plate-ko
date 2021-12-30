import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useHistory } from 'react-router-dom';

function RegisterPage(props) {

const dispatch = useDispatch();
   // const history = useHistory();

    const [Email, setEmail]= useState('')
    const [Name, setName]= useState('')
    const [Password, setPassword]= useState('')
    const [ConfirmPassword, setConfirmPassword]= useState('')

    // email, password 공간에 입력가능하게끔 해보자
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();   // 클릭시 무조건적인 page refresh 방지
 
    // * server/index.js의 app.post('/api/users/login', (req,res)=>{ 부분으로 보내는 부분
      let body = { email: Email, password: Password, name: Name }

      if(Password !== ConfirmPassword){
          return alert ('Password와 ConfirmPassword가 일치하지 않습니다.')
      }
      // dispatch 이용해 action을 취한다 (user_action.js) 이게 redux 사용 (30강)
      dispatch(registerUser(body))   
      // login 되면 Landingpage가 뜨게 해준다
      .then(response => {
          if(response.payload.loginSuccess){
            props.history.push('/login')    //react에서 페이지 이동시킬 때 쓰는 공식
          }else{
              alert('Failed to sign up')
          }
      })
    }


    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: "column"}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br/>
                <button>Sign Up!</button>
            </form>
            </div>
    )
}

export default RegisterPage
