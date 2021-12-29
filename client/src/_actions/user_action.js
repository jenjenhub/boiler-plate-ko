import axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(dataToSubmit){
    const request = axios.post('/api/users/login', dataToSubmit)  //server로 보냄
      .then(response => response.data)  //server에서 받은 response를 request라 선언

return {
    //reducer는 previousState과 action(여기 위에 있는부분)을 조합해서 nextState를 만들기 때문에
    //request를 reducer에 넘겨준다.
    type : LOGIN_USER,
    payload : request
       }   // 이걸 reducer로 보냄 (user_reducer.js으로)
    }