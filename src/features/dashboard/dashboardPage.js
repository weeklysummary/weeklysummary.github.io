import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Copyright } from '../../components/Copyright';
import { useSelector, useDispatch } from "react-redux";
import { Typography } from '@mui/material';
import { getAllData } from "./dashboardSlice";
import Box from "@mui/material/Box";
import moment from 'moment'
import _ from 'lodash';
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
import getRandomColor from "../../common/ColorGenerator";
import { Bar, Pie } from 'react-chartjs-2';
import Carousel from 'react-material-ui-carousel'
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Deloitte Monthly Created Vs Resolved',
        },
    },
};
export const deloitte_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Incoming Tickets - Deloitte',
        },
    },
};
export const deloitte_resolved_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Resolved Tickets - Deloitte',
        },
    },
};
export const avient_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Incoming Tickets - Avient',
        },
    },
};
export const avient_resolved_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Resolved Tickets - Avient',
        },
    },
};
export const ageing0to5_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Ageing 0 - 5 Days',
        },
    },
};
export const ageing6to10_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Ageing 6 - 10 Days',
        },
    },
};
export const ageingmorethan10_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Ageing > 10 Days',
        },
    },
};

export default function DashboardPage() {
    const dispatch = useDispatch();
    const [dataList, setDataList] = useState([]);
    const [graph1Data, setGraph1Data] = useState({});
    const [deloitteGraphData, setDeloitteGraphData] = useState({});
    const [deloitteResolvedGraphData, setDeloitteResolvedGraphData] = useState({});
    const [avientGraphData, setAvientGraphData] = useState({});
    const [avientResolvedGraphData, setAvientResolvedGraphData] = useState({});

    const [crSummary, setCRSummary] = useState([]);
    const [ageing0to5Days, setAgeing0to5Days] = useState({});
    const [ageing6to10Days, setAgeing6to10Days] = useState({});
    const [ageingMoreThan10Days, setAgeingMoreThan10Days] = useState({});


    const { loading, errors, list } = useSelector((state) => state.dashboard)

    useEffect(() => {
        dispatch(getAllData());
    }, [dispatch]);

    useEffect(() => {
        let newList = list;
        let newData = newList.map((item) =>
            Object.assign({}, item, {
                Month: moment(new Date(item.Opened)).format("MMMM"),
                OpenedMonth: moment(new Date(item.Opened)).format("MMMM"),
                ResolvedMonth: moment(new Date(item.Resolved)).format("MMMM"),
                Ageing: moment(new Date()).diff(new Date(item.Opened), 'days')
            })
        );
        setDataList(newData);
        var sortedResolvedList = _.sortBy(newData, [function (o) { return new Date(o.Resolved); }]);
        var sortedList = _.sortBy(newData, [function (o) { return new Date(o.Opened); }]);
        getMonthWiseChartData(sortedResolvedList);
        getDeloitteChartData(sortedList);
        getDeloitteResolvedChartData(sortedResolvedList);
        getAvientChartData(sortedList);
        getAvientResolvedChartData(sortedList);
        getAgeingChartData0to5Days(sortedList);
        getAgeingChartData6to10Days(sortedList);
        getAgeingChartDataMoreThan10Days(sortedList);
        CRSummary(sortedList);

    }, [list]);

    function getAgeingChartData0to5Days(sortedArray) {

        var ageing0to5days = _(sortedArray).groupBy('Assignmentgroup')
            .map(function (items, Assignmentgroup) {
                var counts = items.filter(m => m.Ageing <= 5 && m.State !== "Closed").length;
                return { assignmentgroup: Assignmentgroup, count: counts };
            }).value();
        var labels = ageing0to5days.map(function (el) { return el.assignmentgroup; });
        var new_data = ageing0to5days.map(function (el) { return el.count; });
        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Ageing 0 - 5 Days",
                    data: new_data,
                    backgroundColor: getRandomColor(new_data.length)
                }
            ]
        }
        setAgeing0to5Days(graphData);

    }
    function getAgeingChartData6to10Days(sortedArray) {

        var ageing6to10days = _(sortedArray).groupBy('Assignmentgroup')
            .map(function (items, Assignmentgroup) {
                var counts = items.filter(m => m.Ageing <= 10 && m.Ageing >= 6 && m.State !== "Closed").length;
                return { assignmentgroup: Assignmentgroup, count: counts };
            }).value();
        var labels = ageing6to10days.map(function (el) { return el.assignmentgroup; });
        var new_data = ageing6to10days.map(function (el) { return el.count; });
        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Ageing 6 - 10 Days",
                    data: new_data,
                    backgroundColor: getRandomColor(new_data.length)
                }
            ]
        }
        setAgeing6to10Days(graphData);

    }
    function getAgeingChartDataMoreThan10Days(sortedArray) {

        var ageingmorethan10days = _(sortedArray).groupBy('Assignmentgroup')
            .map(function (items, Assignmentgroup) {
                var counts = items.filter(m => m.Ageing > 10 && m.State !== "Closed").length;
                return { assignmentgroup: Assignmentgroup, count: counts };
            }).value();


        var labels = ageingmorethan10days.map(function (el) { return el.assignmentgroup; });
        var new_data = ageingmorethan10days.map(function (el) { return el.count; });
        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Ageing >10 Days",
                    data: new_data,
                    backgroundColor: getRandomColor(new_data.length)
                }
            ]
        }
        setAgeingMoreThan10Days(graphData);

    }

    function getMonthWiseChartData(sortedArray) {
        var newStateList = _(sortedArray).filter(m => m.Opened !== "" && m.Company === "Deloitte").groupBy('OpenedMonth')
            .map(function (items, OpenedMonth) {
                let i = items.filter(m => m.Opened !== "");
                return { month: OpenedMonth, count: i.length };
            }).value();

        var closedStateList = _(sortedArray).filter(m => m.Resolved !== "" && m.Company === "Deloitte")
            .groupBy('ResolvedMonth')
            .map(function (items, ResolvedMonth) {
                let i = items.filter(m => m.Resolved !== "");
                return { month: ResolvedMonth, count: i.length };
            }).value();

        // var newBacklogList = _(sortedArray).filter(m => (m.Opened !== "" && m.Resolved==="") && m.Company === "Deloitte").groupBy('OpenedMonth')
        //     .map(function (items, OpenedMonth) {
        //         let i = items;
        //         return { month: OpenedMonth, count: i.length };
        //     }).value();

        var labels = closedStateList.map(function (el) { return el.month; });
        var new_data = newStateList.map(function (el) { return el.count; });
        var closed_data = closedStateList.map(function (el) { return el.count; });
        //var backlog_data = newBacklogList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Created",
                    data: new_data,
                    backgroundColor: '#4574C4',
                },
                {
                    label: "Resolved",
                    data: closed_data,
                    backgroundColor: '#92d050',
                }
            ]
        }
        setGraph1Data(graphData);
    }

    function getDeloitteChartData(sortedArray) {
        var deloitteList = _(sortedArray).filter(m=>m.Opened!=="").groupBy('OpenedMonth')
            .map(function (items, OpenedMonth) {
                let i = items.filter(m => m.Company === "Deloitte");
                return { month: OpenedMonth, count: i.length };
            }).value();

        var labels = deloitteList.map(function (el) { return el.month; });
        var data = deloitteList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Deloitte",
                    data: data,
                    backgroundColor: '#92d050',
                },

            ]
        }
        setDeloitteGraphData(graphData);
    }
    function getDeloitteResolvedChartData(sortedArray) {
        var deloitteList = _(sortedArray).filter(m=>m.Resolved!=="").groupBy('ResolvedMonth')
            .map(function (items, ResolvedMonth) {
                let i = items.filter(m => m.Company === "Deloitte");
                return { month: ResolvedMonth, count: i.length };
            }).value();

        var labels = deloitteList.map(function (el) { return el.month; });
        var data = deloitteList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Deloitte",
                    data: data,
                    backgroundColor: '#92d050',
                },

            ]
        }
        setDeloitteResolvedGraphData(graphData);
    }

    function getAvientChartData(sortedArray) {
        var avientList = _(sortedArray).filter(m=>m.Opened!=="").groupBy('OpenedMonth')
            .map(function (items, OpenedMonth) {
                let i = items.filter(m => m.Company === "Avient");
                return { month: OpenedMonth, count: i.length };
            }).value();

        var labels = avientList.map(function (el) { return el.month; });
        var data = avientList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Avient",
                    data: data,
                    backgroundColor: '#4574C4',
                },

            ]
        }
        setAvientGraphData(graphData);
    }
    function getAvientResolvedChartData(sortedArray) {
        var avientList = _(sortedArray).filter(m=>m.Resolved!=="").groupBy('ResolvedMonth')
            .map(function (items, ResolvedMonth) {
                let i = items.filter(m => m.Company === "Avient");
                return { month: ResolvedMonth, count: i.length };
            }).value();

        var labels = avientList.map(function (el) { return el.month; });
        var data = avientList.map(function (el) { return el.count; });

        let graphData = {
            labels: labels,
            datasets: [
                {
                    label: "Avient",
                    data: data,
                    backgroundColor: '#4574C4',
                },

            ]
        }
        setAvientResolvedGraphData(graphData);
    }

    function CRSummary(sortedArray) {
        var filteredArray=sortedArray.filter(m=>m.Company==="Deloitte");
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
                map1['GrandTotal'] = grandTotal;
                return { assignmentgroup: Assignmentgroup, ...map1 };
            }).value();
        
        
            let resolvedTotal = 0, closedTotal = 0, InProgressTotal = 0, OnHoldTotal = 0, GrandTotal = 0;
            let cr_summary = crsummary.map(function (item, index) {
                resolvedTotal += item.Resolved;
                closedTotal += item.Closed;
                InProgressTotal += item["In Progress"];
                OnHoldTotal += item["On Hold"];
                GrandTotal += item["GrandTotal"];
                return {Id: index + 1,...item};
            }
    
            );
            
            var grandTotalItem = {
                'assignmentgroup':'Grand Total',
                'Resolved': resolvedTotal,
                'In Progress': InProgressTotal,
                'Closed': closedTotal,
                'On Hold': OnHoldTotal,
                "GrandTotal": GrandTotal,
                Id:cr_summary.length+1
            };
            
            //console.log("grandTotalItem", grandTotalItem);
            cr_summary.push(grandTotalItem);




        setCRSummary(cr_summary);
    }



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
            <Container maxWidth="100%" sx={{ width: '100%', mt: 10, mb: 4, height: '100vh' }}>
                <Carousel autoPlay={false} indicators={false} navButtonsAlwaysVisible={false}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} md={12} lg={12}>
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
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/teamperformance?company=Deloitte">Show more</Link>
                            </Box>
                        </Grid>
                       

                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(deloitteGraphData) && <Bar options={deloitte_options} data={deloitteGraphData} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/amsteamperformance?company=Deloitte">Show more</Link>


                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(deloitteResolvedGraphData) && <Bar options={deloitte_resolved_options} data={deloitteResolvedGraphData} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/amsteamperformance?company=Deloitte">Show more</Link>


                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(avientGraphData) && <Bar options={avient_options} data={avientGraphData} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/amsteamperformance?company=Avient">Show more</Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(avientResolvedGraphData) && <Bar options={avient_resolved_options} data={avientResolvedGraphData} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/amsteamperformance?company=Avient">Show more</Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(ageing6to10Days) && <Pie options={ageing6to10_options} data={ageing6to10Days} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/ageingsummary6to10">Show more</Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(ageing0to5Days) && <Pie options={ageing0to5_options} data={ageing0to5Days} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/ageingsummary0to5">Show more</Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 300

                                }}
                            >
                                {!_.isEmpty(ageingMoreThan10Days) && <Pie options={ageingmorethan10_options} data={ageingMoreThan10Days} />}

                            </Paper>
                            <Box display={'flex'} justifyItems={'center'} justifyContent={'center'} alignItems={'center'}>
                                <Link to="/ageingsummarymorethan10">Show more</Link>
                            </Box>
                        </Grid>
                    
                    </Grid>
                </Carousel>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Assignment Group</StyledTableCell>
                                        <StyledTableCell align="left">Closed</StyledTableCell>
                                        <StyledTableCell align="left">In Progress</StyledTableCell>
                                        <StyledTableCell align="left">Resolved</StyledTableCell>
                                        <StyledTableCell align="left">On Hold</StyledTableCell>
                                        <StyledTableCell align="left">Grand Total</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {crSummary.map((row) => (
                                        <StyledTableRow key={row.assignmentgroup}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.assignmentgroup}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{row.Closed}</StyledTableCell>
                                            <StyledTableCell align="left">{row["In Progress"]}</StyledTableCell>
                                            <StyledTableCell align="left">{row.Resolved}</StyledTableCell>
                                            <StyledTableCell align="left">{row["On Hold"]}</StyledTableCell>
                                            <StyledTableCell align="left">{row.GrandTotal}</StyledTableCell>

                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Box >


    )
}