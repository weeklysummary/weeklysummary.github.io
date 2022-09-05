import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Copyright } from '../../components/Copyright';
import { useSelector, useDispatch } from "react-redux";
import { Typography } from '@mui/material';
import { getAllHolidays } from "./HolidaysSlice";
import Box from "@mui/material/Box";
import _ from 'lodash';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import AddIcon from '@mui/icons-material/Add';

import BootstrapDialogTitle from '../../components/BootstrapDialogTitle';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import moment from 'moment'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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


export default function HolidaysPage() {
    const [initValues, setInitValues] = React.useState({
        Id: 0,
        Date: '',
        Holiday: '',
        DayOfWeek: ''
    });

    const validationSchema = yup.object({
        Date: yup
            .string('Enter a valid date')
            .required('Date is required'),
        Holiday: yup
            .string('Enter holiday')
            .required('Holiday is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            if (values.Id > 0) {
                const newList = holidaysList.map(obj => {
                    if (obj.Id === values.Id) {
                        return {
                            ...obj,
                            Date: moment(values.Date, 'YYYY-MM-DD').format("DD-MMM-YY"),
                            Holiday: values.Holiday,
                            DayOfWeek: moment(values.Date).format("dddd")
                        };
                    }
                    return obj;
                });
                SetHolidaysList(newList);
                setOpen(false);
            }
            else {
                let oldList = holidaysList.length > 0 ? [...holidaysList] : [];
                let maxId = oldList.length > 0 ? _.maxBy(oldList, function (o) { return o.Id; }).Id : 0;
                let item = {
                    Id: maxId + 1,
                    Date: moment(values.Date).format("DD-MMM-YY"),
                    DayOfWeek: moment(values.Date).format("dddd"),
                    Holiday: values.Holiday
                };
                oldList.push(item);
                SetHolidaysList(oldList);
                setOpen(false);
                setInitValues({
                    Id: 0,
                    Date: '',
                    Holiday: '',
                    DayOfWeek: ''
                });
            }
        },
    });

    const [open, setOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("Add Holiday");

    const handleEditClickOpen = (item) => {
        setInitValues({
            Id: item.Id,
            Date: moment(item.Date).format("YYYY-MM-DD"),
            DayOfWeek: moment(item.Date).format("dddd"),
            Holiday: item.Holiday
        });
        setOpen(true);
    };
    const handleAddHolidayClick = () => {
        console.log("Add Holiday Clicked");
        setModalTitle("Add Holiday")
        setInitValues({
            Id: 0,
            Date: '',
            Holiday: '',
            DayOfWeek: ''
        });
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch();
    const [holidaysList, SetHolidaysList] = useState([]);
    const { loading, errors, list } = useSelector((state) => state.holidays)

    useEffect(() => {
        dispatch(getAllHolidays());
    }, [dispatch]);

    useEffect(() => {
        let newList = list;
        SetHolidaysList(newList);
    }, [list]);





    const columns = [
        {
            field: 'DayOfWeek', headerName: 'Day Of Week', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Date', headerName: 'Date', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Holiday', headerName: 'Holiday', flex: 1, headerClassName: 'super-app-theme--header',
        },
        {
            field: 'Action', headerName: 'Action', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const onEditClick = (e) => {
                    e.stopPropagation();
                    setModalTitle("Edit Holiday")
                    return handleEditClickOpen(params.row);
                };
                const onDeleteClick = (e) => {
                    e.stopPropagation();
                    SetHolidaysList(holidaysList.filter(function (i) {
                        return i.Id !== params.row.Id
                    }));
                };

                return (
                    <React.Fragment>
                        <IconButton size='small' onClick={onEditClick} color="success" component="label">
                            <EditIcon />
                        </IconButton>
                        <IconButton size='small' onClick={onDeleteClick} color="error" component="label">
                            <DeleteIcon />
                        </IconButton>
                    </React.Fragment>
                );
            }

        }

    ];


    return (
        <React.Fragment>
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
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '500px',
                                    '& .super-app-theme--header': {
                                        backgroundColor: '#000000',
                                        color: '#ffffff'
                                    },
                                    '& .super-app-theme--header svg': {
                                        color: '#ffffff'
                                    },
                                    width: '100%'
                                }}
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 1 }}
                                >
                                    <Grid item><Typography sx={{fontSize:'25px'}}>
                                        {"Avient Operate – USI Holiday List"}</Typography></Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={handleAddHolidayClick} startIcon={<AddIcon />}>
                                            Add Holiday
                                        </Button>
                                    </Grid>
                                </Grid>
                                <StripedDataGrid autoHeight={false} getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                } getRowId={(row) => row.Id} rows={holidaysList} columns={columns} components={{ Toolbar: GridToolbar }} />

                            </Paper>
                        </Grid>

                    </Grid>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>




            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth="md"

            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {modalTitle}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={formik.handleSubmit}
                    >
                        <div>
                            <TextField
                                fullWidth
                                id="date"
                                name="Date"
                                label="Date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="date"
                                value={formik.values.Date}
                                onChange={formik.handleChange}
                                error={formik.touched.Date && Boolean(formik.errors.Date)}
                                helperText={formik.touched.Date && formik.errors.Date}
                            />
                            <TextField
                                fullWidth
                                id="Holiday"
                                name="Holiday"
                                label="Holiday"
                                type="text"
                                value={formik.values.Holiday}
                                onChange={formik.handleChange}
                                error={formik.touched.Holiday && Boolean(formik.errors.Holiday)}
                                helperText={formik.touched.Holiday && formik.errors.Holiday}
                            />
                        </div>
                        <div>
                            <Button variant="contained" color="success" type='submit' autoFocus>
                                Save
                            </Button>
                        </div>

                    </Box>

                </DialogContent>

            </BootstrapDialog>
        </React.Fragment>



    )
}