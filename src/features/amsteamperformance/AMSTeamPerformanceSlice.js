import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {getExceptionPayload} from "../../common/exceptionPayload"
import dashboardData from '../../fakedb/data.json';


export const getAllData = createAsyncThunk(
  'amsteamperformance/getAllData',
  async (_,{rejectWithValue}) => {
    try {
      //const res = await API.get('posts');
      const res=dashboardData;
      return res.data;
    }
    catch (error) {
      return rejectWithValue(getExceptionPayload(error));
    }

  }
);

export const AMSTeamPerformanceSlice = createSlice({
  name: 'amsteamperformance',
  initialState: { list: [], errors: [] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllData.pending, state => {
        state.loading = true;
        state.errors = [];
      })
      .addCase(getAllData.fulfilled, (state, action) => {
        state.errors = [];
        state.loading = false;
        state.list = action.payload;

      })
      .addCase(getAllData.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors=payload.errors;
      })
  }
});



export default AMSTeamPerformanceSlice.reducer;

