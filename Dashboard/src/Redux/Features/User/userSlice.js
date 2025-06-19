import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
  isPasswordVerified:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMydata:(state, action) => {
        state.value = action.payload
    },
    changePasswordVerified:(state, action) => {
        state.isPasswordVerified = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMydata,changePasswordVerified } = userSlice.actions

export default userSlice.reducer