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

export default function CRSummaryPage() {
    const dispatch = useDispatch();
    const [crSummary, setCRSummary] = useState([]);
    const { loading, errors, list } = useSelector((state) => state.crsummary)
 console.log("list3",list);
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
        var states = sortedArray.map(function (el) { return el.State; });
        var uniqueStates = _.uniqBy(states, function (e) {
            return e;
        });
        var crsummary = _(sortedArray).groupBy('Assignmentgroup')
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

        let cr_summary = crsummary.map((item, index) =>
            Object.assign({}, item, { Id: index + 1 })
        );




        setCRSummary(cr_summary);
    }
    const columns = [
        { field: 'assignmentgroup', headerName: 'Assignment Group', width: 180, headerClassName: 'super-app-theme--header' },
        {
            field: 'Authorize', headerName: 'Authorize',flex:1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Closed', headerName: 'Closed',flex:1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Implement', headerName: 'Implement',flex:1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'New', headerName: 'New',flex:1, headerClassName: 'super-app-theme--header'
        }, {
            field: 'Review', headerName: 'Review',flex:1, headerClassName: 'super-app-theme--header'
        }, {
            field: 'Scheduled', headerName: 'Scheduled',flex:1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Grand Total', headerName: 'Grand Total',flex:1, headerClassName: 'super-app-theme--header'
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
                                width:'100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#000000',
                                    color: '#ffffff'
                                },
                                '& .super-app-theme--header svg': {
                                    color: '#ffffff'
                                }
                            }}
                        >
                            <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={12} md={12} lg={12}>
                                <Typography component={"p"} sx={{ fontSize: '25px' }}>{"CR Summary"}</Typography>
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