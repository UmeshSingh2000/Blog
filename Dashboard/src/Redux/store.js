import { configureStore } from '@reduxjs/toolkit'
import myBlogsReducer from './Features/Blog/blogSlice'
import userReducer from './Features/User/userSlice'
export const store = configureStore({
  reducer: {
    myBlogs : myBlogsReducer,
    user : userReducer
  },
})