const AuthReducer = (state, action)=>{
    switch(action.type){
        case "LOGIN_START":
            return{
                user : null,
                isfetching : true,
                error : false
            };
        case "LOGIN_SUCCESS":
            return{
                user : action.payload,
                isfetching : false,
                error : false
            };
        case "LOGIN_FAILURE":
            return{
                user : null,
                isfetching : false,
                error : action.payload
            };
        case "FOLLOW":
            return {
                ...state,
                user : {
                    ...state.user,
                    following : [ ...state.user.following, action.payload]
                },
            };
        case "UNFOLLOW":
            return {
                ...state,
                user : {
                    ...state.user,
                    following : state.user.following.filter(follow=>follow !== action.payload )
                }
            }
        case "FETCHFOLLOW":
            return {
                ...state,
                user : {
                    ...state.user,
                    following : [ ...state.user.following, action.payload ]
                }
            }
        default:
            return state;
    }
};

export default AuthReducer;