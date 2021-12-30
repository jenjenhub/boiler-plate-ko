//login, register 기능 만들때 작성할것임
import { LOGIN_USER, REGISTER_USER } from '../_actions/types';

export default function (state = {}, action) {    //여기 state는 previousState. state = {}는 현재 state가 비어있다는 뜻
    switch (action.type) {
        case LOGIN_USER: 
           return { ...state, loginSuccess: action.payload }     //spread operator 사용해 비어있는 state를 그대로 가져옴/ action.payload는 user_action.js에서 그대로 가져옴
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;

    default:
        return state;
    }
}