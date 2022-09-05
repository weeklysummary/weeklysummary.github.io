import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/DashboardLayout';
//
import DashboardPage from './features/dashboard/dashboardPage';
import CRSummaryPage from './features/crsummary/CRSummaryPage';
import AgeingSummaryPage from './features/ageingsummary/AgeingSummaryPage';
import HolidaysPage from './features/hoildays/HolidaysPage';
import TeamPerformancePage from './features/teamperformance/TeamPerformancePage';
import AMSTeamPerformancePage from './features/amsteamperformance/AMSTeamPerformancePage';
import AgeingSummary0To5Page from './features/ageingsummary0to5/AgeingSummary0To5Page';
import AgeingSummary6To10Page from './features/ageingsummary6to10/AgeingSummary6To10Page';
import AgeingSummaryMoreThan10Page from './features/ageingsummarymorethan10/AgeingSummaryMoreThan10Page';
import ShiftCoveragePage from './features/shiftcoverage/ShiftCoveragePage';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" /> },
        ],
      },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <DashboardPage /> },
      ],
    },
    {
      path: '/crsummary',
      element: <DashboardLayout />,
      children: [
        { path: '/crsummary', element: <CRSummaryPage /> },
      ],
    },
    {
      path: '/ageingsummary',
      element: <DashboardLayout />,
      children: [
        { path: '/ageingsummary', element: <AgeingSummaryPage /> },
      ],
    },
    {
      path: '/holidays',
      element: <DashboardLayout />,
      children: [
        { path: '/holidays', element: <HolidaysPage /> },
      ],
    },
    {
      path: '/teamperformance',
      element: <DashboardLayout />,
      children: [
        { path: '/teamperformance', element: <TeamPerformancePage /> },
      ],
    },
    {
      path: '/amsteamperformance',
      element: <DashboardLayout />,
      children: [
        { path: '/amsteamperformance', element: <AMSTeamPerformancePage /> },
      ],
    },
    {
      path: '/ageingsummary0to5',
      element: <DashboardLayout />,
      children: [
        { path: '/ageingsummary0to5', element: <AgeingSummary0To5Page /> },
      ],
    },
    {
      path: '/ageingsummary6to10',
      element: <DashboardLayout />,
      children: [
        { path: '/ageingsummary6to10', element: <AgeingSummary6To10Page /> },
      ],
    },
    {
      path: '/ageingsummarymorethan10',
      element: <DashboardLayout />,
      children: [
        { path: '/ageingsummarymorethan10', element: <AgeingSummaryMoreThan10Page /> },
      ],
    },
    {
      path: '/shiftcoverage',
      element: <DashboardLayout />,
      children: [
        { path: '/shiftcoverage', element: <ShiftCoveragePage /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    }
  ]);
}