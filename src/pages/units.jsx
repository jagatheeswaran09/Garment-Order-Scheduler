import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    Snackbar,
    Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Table from '../components/table';
import { useCreate, Usedelete, useFetch, useUpdate } from '../services/use_service';
import UnitForm from '../components/unit/unit_form';

const UnitMaster = () => {
    const [openModal, setOpenModal] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(null);
    const [units, setUnits] = useState([]); // Initialize as empty array
    const [toast, setToast] = useState({
        severity: 'success',
        message: '',
        isOpen: false
    });

    const [formData, setFormData] = useState({
        name: '',
        location: ''
    });
    
     const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            minWidth: 150
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            minWidth: 150
        }
    ];

    const handleOpenModal = (unit = null) => {
        setCurrentUnit(unit);
        setFormData(unit || { name: '', location: '' });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentUnit(null);
        setFormData({ name: '', location: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUnit) {
                // Check for duplicate name (excluding current unit)
                const nameExists = units.some(
                    unit => unit.name === formData.name
                );

                if (nameExists) {
                    setToast({
                        severity: 'error',
                        message: 'Unit name already exists',
                        isOpen: true
                    });
                    return;
                }

                await useUpdate(currentUnit.id, formData, "units");
                setToast({
                    severity: 'success',
                    message: 'Unit updated successfully',
                    isOpen: true
                });
            } else {
                const nameExists = units.some(unit => unit.name === formData.name);
                if (nameExists) {
                    setToast({
                        severity: 'error',
                        message: 'Unit name already exists',
                        isOpen: true
                    });
                    return;
                }

                await useCreate(formData, "units");
                setToast({
                    severity: 'success',
                    message: 'Unit created successfully',
                    isOpen: true
                });
            }

            fetchUnits();
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
        await Usedelete(id, "units");
        fetchUnits();
        setToast({
            severity: 'success',
            message: 'Unit deleted successfully',
            isOpen: true
        });
    };


    const fetchUnits = async () => {
        try {
            const fetchedUnits = await useFetch("units");
            setUnits(fetchedUnits || []); // Ensure we always have an array
        } catch (error) {
            console.error('Error fetching units:', error);
            setUnits([]);
        }
    };

    useEffect(() => {
        fetchUnits();
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
                    Unit Master
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                >
                    Add Unit
                </Button>
            </Box>

            <Table
                columns={columns}
                dataSource={units}
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
                    {currentUnit ? 'Edit Unit' : 'Add New Unit'}
                </DialogTitle>
                <UnitForm currentUnit={currentUnit} formData={formData} handleCloseModal={handleCloseModal} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
            </Dialog>
        </Container>
    );
};

export default UnitMaster;