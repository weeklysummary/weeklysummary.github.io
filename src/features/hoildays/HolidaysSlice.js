import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {getExceptionPayload} from "../../common/exceptionPayload"
import holidaysData from '../../fakedb/holidays.json';


export const getAllHolidays = createAsyncThunk(
  'holidays/getAllHolidays',
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

export const HolidaysSlice = createSlice({
  name: 'holidays',
  initialState: { list: [], errors: [] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllHolidays.pending, state => {
        state.loading = true;
        state.errors = [];
      })
      .addCase(getAllHolidays.fulfilled, (state, action) => {
        state.errors = [];
        state.loading = false;
        state.list = action.payload;

      })
      .addCase(getAllHolidays.rejected, (state, { payload }) => {
        state.loading = false;
        state.errors=payload.errors;
      })
  }
});



export default HolidaysSlice.reducer;

