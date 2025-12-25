import axiosClient from "../utils/axiosClient"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit";


//for handling register user api and code verification
const registerUser = createAsyncThunk('user/register',
    async(registerData,{rejectWithValue})=>{
        try{
           const response = await axiosClient.post('user/auth/register',registerData);
           return response.data.user;
        }
        catch(err){
         const message =
        err.response?.data?.message || 'Network error. Please try again.';
           return rejectWithValue(message);
        }
    }
)
//for handling login user api
const loginUser = createAsyncThunk('user/login',
    async(loginData,{rejectWithValue})=>{
        try{
           const response = await axiosClient.post('user/auth/login',loginData);
           console.log("authSlice response :", response);
           return response.data.user;
        }
        catch(err){
            const message =
        err.response?.data?.message || 'Network error. Please try again.';
           return rejectWithValue(message);
        }
    }
)
// for handling google auth login...
const loginGoogleUser = createAsyncThunk('user/provider/login',
    async({loginData,provider},{rejectWithValue})=>{
        try{
           console.log("authSlice loginData",loginData);
           const response = await axiosClient.post(`user/auth/${provider}`,loginData);
           console.log("authSlice response :", response.data);
           return response.data.user;
        }
        catch(err){
            const message =
        err.response?.data?.message || 'Network error. Please try again.';
           return rejectWithValue(message);
        }
    }
)

//for handling logout user api
const logoutUser = createAsyncThunk('user/logout',
    async(_,{rejectWithValue})=>{
        try{
           const response = await axiosClient.post('user/auth/logout');
           return null;
        }
        catch(err){
            const message =
        err.response?.data?.message || 'Network error. Please try again.';
           return rejectWithValue(message);
        }
    }
)
//for handling authentication user api
const authenticateUser = createAsyncThunk('user/authenticate',
    async(_,{rejectWithValue})=>{
        try{
           const response = await axiosClient.get('user/auth/check');
           console.log(response);
           return response.data.user;
        }
        catch(err){
            const message =
        err.response?.data?.message || 'Network error. Please try again.';
           return rejectWithValue(message);
        }
    }
)

const authSlice = createSlice({
  name: 'auth',
  initialState:{
    isAuthorized:false,
    error:null,
    loading:false,
    user:null
  },
  reducers: {},
  extraReducers: (builder) => {
    //for register...
    builder.addCase(registerUser.pending, (state, action) => {
       state.error = null,
       state.loading = true;
    })
     builder.addCase(registerUser.fulfilled, (state, action) => {
       state.isAuthorized = true,
       state.loading = false;
       state.error = null;
       console.log("this is action payload",action);
       state.user = action.payload;
    })
     builder.addCase(registerUser.rejected, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = action.payload?.message||"Something went wrong!"
    })

    //for login user...
     builder.addCase(loginUser.pending, (state, action) => {
       state.error = null,
       state.loading = true;
    })
     builder.addCase(loginUser.fulfilled, (state, action) => {
       state.isAuthorized = true,
       state.loading = false;
       state.error = null;
       console.log("this is action payload",action);
       state.user = action.payload;
       //console.log("This is action.payload",action.payload);
    })
     builder.addCase(loginUser.rejected, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = action.payload?.message||"Something went wrong!"
    })

        //for login through google...
     builder.addCase(loginGoogleUser.pending, (state, action) => {
       state.error = null,
       state.loading = true;
    })
     builder.addCase(loginGoogleUser.fulfilled, (state, action) => {
       state.isAuthorized = true,
       state.loading = false;
       state.error = null;
       console.log("this is action payload",action);
       state.user = action.payload;
       //console.log("This is action.payload",action.payload);
    })
     builder.addCase(loginGoogleUser.rejected, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = action.payload?.message||"Something went wrong!"
    })

    //for logout user...
     builder.addCase(logoutUser.pending, (state, action) => {
       state.error = null,
       state.loading = true;
    })
     builder.addCase(logoutUser.fulfilled, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = null;
    })
     builder.addCase(logoutUser.rejected, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = action.payload?.message||"Something went wrong!"
    })
    
    //for authenticate user...
     builder.addCase(authenticateUser.pending, (state, action) => {
       state.error = null,
       state.loading = true;
    })
     builder.addCase(authenticateUser.fulfilled, (state, action) => {
       state.isAuthorized = true,
       state.loading = false;
       state.error = null;
       console.log("this is action payload",action);
       state.user = action.payload;
    })
     builder.addCase(authenticateUser.rejected, (state, action) => {
       state.isAuthorized = false,
       state.loading = false;
       state.error = action.payload?.message||"Something went wrong!"
    })
  },
})

export { registerUser,loginUser,logoutUser,authenticateUser,loginGoogleUser };

export default authSlice.reducer;