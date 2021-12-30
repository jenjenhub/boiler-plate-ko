import React, {useEffect} from 'react';
import axios from 'axios';

function LandingPage(){
    useEffect(() => {
        axios.get('/api/hello')
        .then((resFromServerIndexJs) => console.log(resFromServerIndexJs))
    }, [])

    const onClickHandler= (props) => {
        axios.get('/api/users/logout')
        .then(response => {
             if(response.data.success){
                 props.history.push('/login')   //로그아웃 버튼 누르면 LoginPage로 redirect
             }else{
                 alert('로그아웃 하는데 실패했습니다.')
        }})
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
       <h3>~~시작페이지~~</h3>

       <button onClick={onClickHandler}>
           Logout
       </button>
        </div>
    )
}

export default LandingPage