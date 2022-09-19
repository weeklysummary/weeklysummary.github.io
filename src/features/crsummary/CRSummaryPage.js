import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Copyright } from '../../components/Copyright';
import { useSelector, useDispatch } from "react-redux";
import { Typography } from '@mui/material';
import { getAllData } from "./CRSummarySlice";
import Box from "@mui/material/Box";
import moment from 'moment'
import _ from 'lodash';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: '#d9e1f2',
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent'
            }
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    )
                }
            }
        }
    },
}));

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'CR Summary',
        },
    },
};
export default function CRSummaryPage() {
    const dispatch = useDispatch();
    const [crSummary, setCRSummary] = useState([]);
    const [graph1Data, setGraph1Data] = useState({});
    const { loading, errors, list } = useSelector((state) => state.crsummary)
    console.log("list3", list);
    useEffect(() => {
        dispatch(getAllData());
    }, [dispatch]);

    useEffect(() => {
        console.log("he");
        let newList = list;
        let newData = newList.map((item) =>
            Object.assign({}, item, { Month: moment(new Date(item.Opened)).format("MMMM") })
        );
        var sortedList = _.sortBy(newData, [function (o) { return new Date(o.Opened); }]);
        CRSummary(sortedList);
    }, [list]);



    function CRSummary(sortedArray) {
        var filteredArray = sortedArray.filter(m => m.Company === "Deloitte");
        var states = filteredArray.map(function (el) { return el.State; });
        var uniqueStates = _.uniqBy(states, function (e) {
            return e;
        });
        var crsummary = _(filteredArray).groupBy('Assignmentgroup')
            .map(function (items, Assignmentgroup) {
                const map1 = {};
                let grandTotal = 0;
                uniqueStates.map((item, index) => {
                    var counts = items.filter(m => m.State === item).length;
                    grandTotal += counts;
                    map1[item] = counts;
                });
                map1['Grand Total'] = grandTotal;
                return { assignmentgroup: Assignmentgroup, ...map1 };
            }).value();

        let resolvedTotal = 0, closedTotal = 0, InProgressTotal = 0, OnHoldTotal = 0, GrandTotal = 0;
        let cr_summary = crsummary.map(function (item, index) {
            resolvedTotal += item.Resolved;
            closedTotal += item.Closed;
            InProgressTotal += item["In Progress"];
            OnHoldTotal += item["On Hold"];
            GrandTotal += item["Grand Total"];
            let OpendedTickets=item["In Progress"]+item["On Hold"];
            let ResolvedTickets=item["Resolved"]+item["Closed"];
            return { Id: index + 1,OpendedTickets:OpendedTickets,ResolvedTickets:ResolvedTickets, ...item };
        }

        );

        var grandTotalItem = {
            'assignmentgroup': 'Grand Total',
            'Resolved': resolvedTotal,
            'In Progress': InProgressTotal,
            'Closed': closedTotal,
            'On Hold': OnHoldTotal,
            "Grand Total": GrandTotal,
            "OpendedTickets":OnHoldTotal+InProgressTotal,
            "ResolvedTickets":closedTotal+resolvedTotal,
             Id: cr_summary.length + 1
        };

        cr_summary.push(grandTotalItem);
        setCRSummary(cr_summary);
        getMonthWiseChartData(cr_summary)
    }

    function getMonthWiseChartData(sortedArray) {

        
       
        var labels = sortedArray.map(function (el) { return el.assignmentgroup; });
        var opened_data = sortedArray.map(function (el) { return el.OpendedTickets; });
        var resolved_data = sortedArray.map(function (el) { return el.ResolvedTickets; });
       

        //var backlog_data = newBacklogList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Opened",
                    data: opened_data,
                    backgroundColor: '#4574C4',
                },
                {
                    label: "Resolved",
                    data: resolved_data,
                    backgroundColor: '#92d050',
                }
            ]
        }
        setGraph1Data(graphData);
    }
    const columns = [
        { field: 'assignmentgroup', headerName: 'Assignment Group', width: 180, headerClassName: 'super-app-theme--header' },

        {
            field: 'Closed', headerName: 'Closed', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'In Progress', headerName: 'In Progress', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Resolved', headerName: 'Resolved', flex: 1, headerClassName: 'super-app-theme--header'
        }, {
            field: 'On Hold', headerName: 'On Hold', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Grand Total', headerName: 'Grand Total', flex: 1, headerClassName: 'super-app-theme--header'
        }
    ];
    return (

        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <Container maxWidth="100%" sx={{ mt: 10, mb: 4, height: '100vh' }}>
                <Grid container spacing={3}>
                    {loading && <Typography>{"Loading..."}</Typography>}
                    {errors.length > 0 && <Typography>{errors.toString()}</Typography>}
                    {/* Chart */}

                    <Grid item container xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
                                width: '100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#000000',
                                    color: '#ffffff'
                                },
                                '& .super-app-theme--header svg': {
                                    color: '#ffffff'
                                }
                            }}
                        >
                            <Grid item sx={{ display: 'flex', justifyContent: 'center',marginBottom:'20px' }} xs={12} md={12} lg={12}>
                                <Typography component={"p"} sx={{ fontSize: '25px' }}>{"CR Summary"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} sx={{marginBottom:'20px'}}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 300
                                    }}
                                >
                                    {!_.isEmpty(graph1Data) && <Bar options={options} data={graph1Data} />}

                                </Paper>

                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <StripedDataGrid sx={{ flex: 1, minHeight: '500px' }} autoHeight={false} getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                } getRowId={(row) => row.Id} rows={crSummary} columns={columns} components={{ Toolbar: GridToolbar }} />

                            </Grid>


                        </Paper>
                    </Grid>

                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Box>


    )
}