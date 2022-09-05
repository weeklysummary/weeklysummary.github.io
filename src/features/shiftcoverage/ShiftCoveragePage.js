import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Copyright } from '../../components/Copyright';
import { useSelector, useDispatch } from "react-redux";
import { Typography } from '@mui/material';
import { getAllShiftCoverage } from "./ShiftCoverageSlice";
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
import moment from 'moment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';




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


export default function ShiftCoveragePage() {
    const [initValues, setInitValues] = React.useState({
        Id: 0,
        Module: '',
        NoOfResources: '',
        Shift1ResourceName: '',
        Shift1Timing: '',
        Shift2ResourceName: '',
        Shift2Timing: '',
        Shift3ResourceName: '',
        Shift3Timing: ''
    });

    const validationSchema = yup.object({
        Module: yup
            .string('Enter a valid Module')
            .required('Module is required'),
        NoOfResources: yup
            .number('Enter a valid No Of Resources')
            .required('No Of Resources is required'),
        Shift1ResourceName: yup
            .string('Enter a valid Shift 1 Resource Name')
            .required('Shift 1 Resource Name is required'),
        Shift1Timing: yup
            .string('Enter a valid Shift 1 Timing')
            .required('Shift 1 Timing is required'),
        Shift2ResourceName: yup
            .string('Enter a valid Shift 2 Resource Name')
            .required('Shift 2 Resource Name is required'),
        Shift2Timing: yup
            .string('Enter a valid Shift 2 Timing')
            .required('Shift 2 Timing is required'),
        Shift3ResourceName: yup
            .string('Enter a valid Shift 3 Resource Name')
            .required('Shift 3 Resource Name is required'),
        Shift3Timing: yup
            .string('Enter a valid Shift 3 Timing')
            .required('Shift 3 Timing is required'),

    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            if (values.Id > 0) {
                const newList = shiftCoverageList.map(obj => {
                    if (obj.Id === values.Id) {
                        return {
                            ...obj,
                            Module: values.Module,
                            NoOfResources: values.NoOfResources,
                            Shift1ResourceName: values.Shift1ResourceName,
                            Shift1Timing: values.Shift1Timing,
                            Shift2ResourceName: values.Shift2ResourceName,
                            Shift2Timing: values.Shift2Timing,
                            Shift3ResourceName: values.Shift3ResourceName,
                            Shift3Timing: values.Shift3Timing,
                            Details: "Timing\nResource Name",
                            Shift1: values.Shift1Timing + "\n" + values.Shift1ResourceName,
                            Shift2: values.Shift2Timing + "\n" + values.Shift2ResourceName,
                            Shift3: values.Shift3Timing + "\n" + values.Shift3ResourceName
                        };
                    }
                    return obj;
                });
                setShiftCoverageList(newList);
                setOpen(false);
            }
            else {
                let oldList = shiftCoverageList.length > 0 ? [...shiftCoverageList] : [];
                let maxId = oldList.length > 0 ? _.maxBy(oldList, function (o) { return o.Id; }).Id : 0;
                let item = {
                    Id: maxId + 1,
                    Module: values.Module,
                    NoOfResources: values.NoOfResources,
                    Shift1ResourceName: values.Shift1ResourceName,
                    Shift1Timing: values.Shift1Timing,
                    Shift2ResourceName: values.Shift2ResourceName,
                    Shift2Timing: values.Shift2Timing,
                    Shift3ResourceName: values.Shift3ResourceName,
                    Shift3Timing: values.Shift3Timing,
                    Details: "Timing\nResource Name",
                    Shift1: values.Shift1Timing + "\n" + values.Shift1ResourceName,
                    Shift2: values.Shift2Timing + "\n" + values.Shift2ResourceName,
                    Shift3: values.Shift3Timing + "\n" + values.Shift3ResourceName
                };
                oldList.push(item);
                setShiftCoverageList(oldList);
                setOpen(false);
                setInitValues({
                    Id: 0,
                    Module: '',
                    NoOfResources: '',
                    Shift1ResourceName: '',
                    Shift1Timing: '',
                    Shift2ResourceName: '',
                    Shift2Timing: '',
                    Shift3ResourceName: '',
                    Shift3Timing: ''
                });
            }
        },
    });

    const [open, setOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("Add Shift Coverage");

    const handleEditClickOpen = (item) => {
        setInitValues({
            Id: item.Id,
            Module: item.Module,
            NoOfResources: item.NoOfResources,
            Shift1ResourceName: item.Shift1ResourceName,
            Shift1Timing: item.Shift1Timing,
            Shift2ResourceName: item.Shift2ResourceName,
            Shift2Timing: item.Shift2Timing,
            Shift3ResourceName: item.Shift3ResourceName,
            Shift3Timing: item.Shift3Timing
        });
        setOpen(true);
    };
    const handleAddShiftCoverageClick = () => {
        console.log("Add Shift Coverage Clicked");
        setModalTitle("Add Shift Coverage")
        setInitValues({
            Id: 0,
            Module: '',
            NoOfResources: '',
            Shift1ResourceName: '',
            Shift1Timing: '',
            Shift2ResourceName: '',
            Shift2Timing: '',
            Shift3ResourceName: '',
            Shift3Timing: ''
        });
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch();
    const [shiftCoverageList, setShiftCoverageList] = useState([]);
    const { loading, errors, list } = useSelector((state) => state.shiftcoverage)

    useEffect(() => {
        dispatch(getAllShiftCoverage());
    }, [dispatch]);

    useEffect(() => {
        let newList = list;
        let newData = newList.map((item) =>
            Object.assign({}, item, {
                Details: "Timing\nResource Name",
                Shift1: item.Shift1Timing + "\n" + item.Shift1ResourceName,
                Shift2: item.Shift2Timing + "\n" + item.Shift2ResourceName,
                Shift3: item.Shift3Timing + "\n" + item.Shift3ResourceName
            })
        );
        setShiftCoverageList(newData);
    }, [list]);





    const columns = [
        {
            field: 'Module', headerName: 'Module', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'NoOfResources', headerName: 'No Of Resources', flex: 1, headerClassName: 'super-app-theme--header'
        },
        {
            field: 'Details', headerName: 'Details', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box>
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {"Timing"}
                            </Typography>
                            <Divider />
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {"Resource Name"}
                            </Typography>
                        </Box>


                    </React.Fragment>
                );
            }
        },
        {
            field: 'Shift1', headerName: 'Shift 1', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box>
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift1Timing}
                            </Typography>
                            <Divider />
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift1ResourceName}
                            </Typography>
                        </Box>


                    </React.Fragment>
                );
            }
        },
        {
            field: 'Shift2', headerName: 'Shift 2', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box>
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift2Timing}
                            </Typography>
                            <Divider />
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift2ResourceName}
                            </Typography>
                        </Box>
                    </React.Fragment>
                );
            }
        },
        {
            field: 'Shift3', headerName: 'Shift 3', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box>
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift3Timing}
                            </Typography>
                            <Divider />
                            <Typography sx={{ fontSize: '13px' }} component={"div"}>
                                {params.row.Shift3ResourceName}
                            </Typography>
                        </Box>
                    </React.Fragment>
                );
            }
        },
        {
            field: 'Action', headerName: 'Action', flex: 1, headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const onEditClick = (e) => {
                    e.stopPropagation();
                    setModalTitle("Edit Shift Coverage")
                    return handleEditClickOpen(params.row);
                };
                const onDeleteClick = (e) => {
                    e.stopPropagation();
                    setShiftCoverageList(shiftCoverageList.filter(function (i) {
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
                                    <Grid item><Typography sx={{ fontSize: '25px' }}>
                                        {"Avient Operate – USI Shift Coverage List"}</Typography></Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={handleAddShiftCoverageClick} startIcon={<AddIcon />}>
                                            Add Shift Coverage
                                        </Button>
                                    </Grid>
                                </Grid>
                                <StripedDataGrid autoHeight={false} getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                } getRowId={(row) => row.Id} rows={shiftCoverageList} columns={columns} components={{ Toolbar: GridToolbar }} />

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
                                id="Module"
                                name="Module"
                                label="Module"
                                type="text"
                                value={formik.values.Module}
                                onChange={formik.handleChange}
                                error={formik.touched.Module && Boolean(formik.errors.Module)}
                                helperText={formik.touched.Module && formik.errors.Module}
                            />
                            <TextField
                                fullWidth
                                id="NoOfResources"
                                name="NoOfResources"
                                label="No Of Resources"
                                type="text"
                                value={formik.values.NoOfResources}
                                onChange={formik.handleChange}
                                error={formik.touched.NoOfResources && Boolean(formik.errors.NoOfResources)}
                                helperText={formik.touched.NoOfResources && formik.errors.NoOfResources}
                            />
                            <TextField
                                fullWidth
                                id="Shift1ResourceName"
                                name="Shift1ResourceName"
                                label="Shift 1 ResourceName"
                                type="text"
                                value={formik.values.Shift1ResourceName}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift1ResourceName && Boolean(formik.errors.Shift1ResourceName)}
                                helperText={formik.touched.Shift1ResourceName && formik.errors.Shift1ResourceName}
                            />
                            <TextField
                                fullWidth
                                id="Shift1Timing"
                                name="Shift1Timing"
                                label="Shift 1 Timing"
                                type="text"
                                value={formik.values.Shift1Timing}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift1Timing && Boolean(formik.errors.Shift1Timing)}
                                helperText={formik.touched.Shift1Timing && formik.errors.Shift1Timing}
                            />
                            <TextField
                                fullWidth
                                id="Shift2ResourceName"
                                name="Shift2ResourceName"
                                label="Shift 2 ResourceName"
                                type="text"
                                value={formik.values.Shift2ResourceName}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift2ResourceName && Boolean(formik.errors.Shift2ResourceName)}
                                helperText={formik.touched.Shift2ResourceName && formik.errors.Shift2ResourceName}
                            />
                            <TextField
                                fullWidth
                                id="Shift2Timing"
                                name="Shift2Timing"
                                label="Shift 2 Timing"
                                type="text"
                                value={formik.values.Shift2Timing}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift2Timing && Boolean(formik.errors.Shift2Timing)}
                                helperText={formik.touched.Shift2Timing && formik.errors.Shift2Timing}
                            />
                            <TextField
                                fullWidth
                                id="Shift3ResourceName"
                                name="Shift3ResourceName"
                                label="Shift 3 ResourceName"
                                type="text"
                                value={formik.values.Shift3ResourceName}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift3ResourceName && Boolean(formik.errors.Shift3ResourceName)}
                                helperText={formik.touched.Shift3ResourceName && formik.errors.Shift3ResourceName}
                            />
                            <TextField
                                fullWidth
                                id="Shift3Timing"
                                name="Shift3Timing"
                                label="Shift 3 Timing"
                                type="text"
                                value={formik.values.Shift3Timing}
                                onChange={formik.handleChange}
                                error={formik.touched.Shift3Timing && Boolean(formik.errors.Shift3Timing)}
                                helperText={formik.touched.Shift3Timing && formik.errors.Shift3Timing}
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