import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {getExceptionPayload} from "../../common/exceptionPayload"
import dashboardData from '../../fakedb/data.json';


export const getAllData = createAsyncThunk(
  'ageingsummary6to10/getAllData',
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

export const AgeingSummary6To10Slice = createSlice({
  name: 'ageingsummary6to10',
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


export const { } = AgeingSummary6To10Slice.actions;

export default AgeingSummary6To10Slice.reducer;

