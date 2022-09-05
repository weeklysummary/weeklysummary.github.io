import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import crsummaryReducer from '../features/crsummary/CRSummarySlice';
import ageingsummaryReducer from '../features/ageingsummary/AgeingSummarySlice';
import holidaysReducer from '../features/hoildays/HolidaysSlice';
import teamperformanceReducer from '../features/teamperformance/TeamPerformanceSlice';
import amsteamperformanceReducer from '../features/amsteamperformance/AMSTeamPerformanceSlice';
import ageingsummary0to5Reducer from '../features/ageingsummary0to5/AgeingSummary0To5Slice';
import ageingsummary6to10Reducer from '../features/ageingsummary6to10/AgeingSummary6To10Slice';
import ageingsummarymorethan10Reducer from '../features/ageingsummarymorethan10/AgeingSummaryMoreThan10Slice';
import shiftcoverageReducer from '../features/shiftcoverage/ShiftCoverageSlice'
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    crsummary: crsummaryReducer,
    ageingsummary:ageingsummaryReducer,
    holidays:holidaysReducer,
    teamperformance:teamperformanceReducer,
    amsteamperformance:amsteamperformanceReducer,
    ageingsummary0to5:ageingsummary0to5Reducer,
    ageingsummary6to10:ageingsummary6to10Reducer,
    ageingsummarymorethan10:ageingsummarymorethan10Reducer,
    shiftcoverage:shiftcoverageReducer


  },
});
