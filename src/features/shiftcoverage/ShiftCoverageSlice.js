import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {getExceptionPayload} from "../../common/exceptionPayload"
import holidaysData from '../../fakedb/shiftcoverage.json';


export const getAllShiftCoverage = createAsyncThunk(
  'shiftcoverage/getAllShiftCoverage',
  async (_,{rejectWithValue}) => {
    try {
      //const res = await API.get('posts');
      const res=holidaysData;
      return res.data;
    }
    catch (error) {
      return rejectWithValue(getExceptionPayload(error));
    }

  }
);

export const ShiftCoverageSlice = createSlice({
  name: 'shiftcoverage',
  initialState: { list: [], errors: [] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllShiftCoverage.pending, state => {
        state.loading = true;
        state.errors = [];
      })
      .addCase(getAllShiftCoverage.fulfilled, (state, action) => {
        state.errors = [];
        state.loading = false;
        state.list = action.payload;

      })
      .addCase(getAllShiftCoverage.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors=payload.errors;
      })
  }
});



export default ShiftCoverageSlice.reducer;

