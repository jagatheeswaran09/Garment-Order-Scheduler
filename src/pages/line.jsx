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
import LineForm from '../components/line/line_form';

const LineMaster = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [lines, setLines] = useState([]); // Initialize as empty array
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
      title: 'Associate Unit',
      dataIndex: 'unit',
      key: 'unit',
      minWidth: 150
    }
  ];

  const handleOpenModal = (Line = null) => {
    setCurrentLine(Line);
    setFormData(Line || { name: '', unit: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLine(null);
    setFormData({ name: '', unit: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLine) {
        const nameExists = lines.filter(
          Line => Line.name === formData.name
        ).length > 1
        if (nameExists) {
          setToast({
            severity: 'error',
            message: 'Line name already exists',
            isOpen: true
          });
          return;
        }

        await useUpdate(currentLine.id, formData, "lines");
        setToast({
          severity: 'success',
          message: 'Line updated successfully',
          isOpen: true
        });
      } else {
        const nameExists = lines.some(Line => Line.name === formData.name);
        if (nameExists) {
          setToast({
            severity: 'error',
            message: 'Line name already exists',
            isOpen: true
          });
          return;
        }

        await useCreate(formData, "lines");
        setToast({
          severity: 'success',
          message: 'Line created successfully',
          isOpen: true
        });
      }

      fetchLines();
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
    await Usedelete(id, "lines");
    fetchLines();
    setToast({
      severity: 'success',
      message: 'Line deleted successfully',
      isOpen: true
    });
  };


  const fetchLines = async () => {
    try {
      const fetchedLines = await useFetch("lines");
      setLines(fetchedLines || []); // Ensure we always have an array
    } catch (error) {
      console.error('Error fetching lines:', error);
      setLines([]);
    }
  };

  useEffect(() => {
    fetchLines();
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
          Line Master
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Add Line
        </Button>
      </Box>

      <Table
        columns={columns}
        dataSource={lines}
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
          {currentLine ? 'Edit Line' : 'Add New Line'}
        </DialogTitle>
        <LineForm currentLine={currentLine} formData={formData} handleCloseModal={handleCloseModal} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </Dialog>
    </Container>
  );
};

export default LineMaster;