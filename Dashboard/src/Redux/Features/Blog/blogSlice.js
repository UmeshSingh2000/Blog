import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setMyBlogs: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setMyBlogs } = blogSlice.actions

export default blogSlice.reducer