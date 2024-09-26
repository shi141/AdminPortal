import { configureStore} from "@reduxjs/toolkit";
const initialstate={
    isloggedin:false,// default : user is not logged in
    username:'',//will store username value
    error:null,//will store any error message in failed login
    password:'',
}
const reducer=(state=initialstate,action)=>{
    switch(action.type){
        case 'login_success':
            return{...state,isloggedin:true,username:action.payload.username,password:action.payload.password};
        case 'login_fail':
            return{...state,isloggedin:false,errror:action.payload.error};
        default:
            return state;
    }
}
const store=configureStore({
    reducer,
});
export default store;