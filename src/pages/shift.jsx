import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    useTheme,
    Snackbar,
    Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Table from '../components/table';
import { useCreate, Usedelete, useFetch, useUpdate } from '../services/use_service';
import ShiftForm from '../components/Shift/Shift_form';

const ShiftMaster = () => {
    const [openModal, setOpenModal] = useState(false);
    const [currentShift, setCurrentShift] = useState(null);
    const [Shifts, setShifts] = useState([]); // Initialize as empty array
    const [toast, setToast] = useState({
        severity: 'success',
        message: '',
        isOpen: false
    });

    const [formData, setFormData] = useState({
        name: '',
        unit: ''
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            minWidth: 150
        },
        {
            title: 'Start Time',
            dataIndex: 'end_time',
            key: 'end_time',
            minWidth: 150
        },
        {
            title: 'End Time',
            dataIndex: 'start_time',
            key: 'end_time',
            minWidth: 150
        }
    ];

    const handleOpenModal = (Shift = null) => {
        setCurrentShift(Shift);
        setFormData(Shift || { name: '', unit: '' });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentShift(null);
        setFormData({ name: '', unit: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentShift) {
                const nameExists = Shifts.filter(
                    Shift => Shift.name === formData.name
                ).length > 1
                if (nameExists) {
                    setToast({
                        severity: 'error',
                        message: 'Shift name already exists',
                        isOpen: true
                    });
                    return;
                }

                await useUpdate(currentShift.id, formData, "shifts");
                setToast({
                    severity: 'success',
                    message: 'Shift updated successfully',
                    isOpen: true
                });
            } else {
                const nameExists = Shifts.some(Shift => Shift.name === formData.name);
                if (nameExists) {
                    setToast({
                        severity: 'error',
                        message: 'Shift name already exists',
                        isOpen: true
                    });
                    return;
                }

                await useCreate(formData, "shifts");
                setToast({
                    severity: 'success',
                    message: 'Shift created successfully',
                    isOpen: true
                });
            }

            fetchShifts();
            handleCloseModal();
        } catch (error) {
            setToast({
                severity: 'error',
                message: 'An error occurred',
                isOpen: true
            });
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        await Usedelete(id, "shifts");
        fetchShifts();
        setToast({
            severity: 'success',
            message: 'Shift deleted successfully',
            isOpen: true
        });
    };


    const fetchShifts = async () => {
        try {
            const fetchedShifts = await useFetch("shifts");
            setShifts(fetchedShifts || []); // Ensure we always have an array
        } catch (error) {
            console.error('Error fetching Shifts:', error);
            setShifts([]);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    return (
        <Container maxWidth='xl' sx={{ mt: 4, mb: 4, width: '100%' }}>
            <Snackbar
                open={toast.isOpen}
                autoHideDuration={6000}
                onClose={() => setToast({ ...toast, isOpen: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={toast.severity}
                    onClose={() => setToast({ ...toast, isOpen: false })}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" component="h1">
                    Shift Master
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                >
                    Add Shift
                </Button>
            </Box>

            <Table
                columns={columns}
                dataSource={Shifts}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {currentShift ? 'Edit Shift' : 'Add New Shift'}
                </DialogTitle>
                <ShiftForm currentShift={currentShift} formData={formData} handleCloseModal={handleCloseModal} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
            </Dialog>
        </Container>
    );
};

export default ShiftMaster;