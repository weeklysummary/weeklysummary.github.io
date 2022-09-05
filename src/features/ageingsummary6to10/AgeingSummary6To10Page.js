import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Copyright } from '../../components/Copyright';
import { useSelector, useDispatch } from "react-redux";
import { Typography } from '@mui/material';
import { getAllData } from "./AgeingSummary6To10Slice";
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


export default function AgeingSummary6To10Page() {
    const dispatch = useDispatch();
    const [ageingSummary6To10, setAgeingSummary6To10] = useState([]);
    const { loading, errors, list } = useSelector((state) => state.ageingsummary6to10)

    useEffect(() => {
        dispatch(getAllData());
    }, [dispatch]);

    useEffect(() => {
        let newList = list;
        let newData = newList.map((item) =>
            Object.assign({}, item, {
                Month: moment(new Date(item.Opened)).format("MMMM"),
                Ageing: moment(new Date()).diff(new Date(item.Opened), 'days')
            })
        );
        var sortedList = _.sortBy(newData, [function (o) { return new Date(o.Opened); }]);
        var newStateList = _(sortedList).groupBy('Assignmentgroup')
            .map(function (items, Assignmentgroup) {
                var counts = items.filter(m => m.Ageing <= 10 && m.Ageing > 5 && m.State !== "Closed").length;
                return { assignmentgroup: Assignmentgroup, counts: counts };
            }).value();
        setAgeingSummary6To10(newStateList);

    }, [list]);
    const columns = [
        {
            field: 'assignmentgroup', headerName: 'Row Labels', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'counts', headerName: 'Count Of Number', flex: 1, headerClassName: 'super-app-theme--header'
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
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
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
                                <Typography component={"p"} sx={{ fontSize: '25px' }}>{"Ageing 6 - 10 Days"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <StripedDataGrid sx={{flex:1,minHeight:'500px'}} autoHeight={false} getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                } getRowId={(row) => row.assignmentgroup} rows={ageingSummary6To10} columns={columns} components={{ Toolbar: GridToolbar }} />

                            </Grid>

                        </Paper>
                    </Grid>

                </Grid>
                <Copyright sx={{ pt: 4 }} />
            </Container>
        </Box>


    )
}