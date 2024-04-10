export const LOGIN_START = (userCredentials)=>({
    type : "LOGIN_START"
});

export const LOGIN_SUCCESS = (user)=>({
    type : "LOGIN_SUCCESS",
    payload : user
})

export const LOGIN_FAILURE = (error)=>({
    type : "LOGIN_FAILURE",
    payload : error
});

export const FOLLOW = (userId)=>({
    type : "FOLLOW",
    payload : userId
});

export const UNFOLLOW = (userId)=>({
    type : "UNFOLLOW",
    payload : userId
});

export const FETCHFOLLOW = (userId)=>({
    tupe : "FETCHFOLLOW",
    payload : userId
})