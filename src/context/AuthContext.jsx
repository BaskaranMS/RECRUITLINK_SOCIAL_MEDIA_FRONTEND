// import { createContext, useReducer } from 'react'
// import AuthReducer from './AuthReducer.js'

// const INITIAL_STATE = {
//     user : {
//         _id: "65db67487f1aba6a285d1710",
//         username:"jenni",
//         password:"$2b$10$u3NXuS8NRKe8d2KfLzyl0eHeutZkNDICCfrpUYZ7kAf3Gc5Xeqwaq",
//         email:"jenni@gmail.com",
//         profilePicture:"",
//         coverPicture:"",
//         followers:[],
//         following:[],
//         isAdmin:false,
//         createdAt:{"$date":{"$numberLong":"1708877640834"}},
//         updatedAt:{"$date":{"$numberLong":"1708935228432"}},
//         __v:{"$numberInt":"0"},
//         desc:"hi i am jenni the angel!!!",
//         city:"thanjavur",
//         from:"india",
//         relationship: 1
//     },
//     isfetching : false,
//     error : false
// };

// export const AuthContext = createContext(INITIAL_STATE)

// export const AuthContextProvider = ({children})=>{
//     const [ state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

//     return (
//         <AuthContext.Provider value={{ user : state.user, 
//             isfetching : state.isfetching, 
//             error : state.error, 
//             dispatch
//         }}>
//             {children}
//         </AuthContext.Provider>
//     )
// };

import { createContext } from 'react';

export const MyContext = createContext();