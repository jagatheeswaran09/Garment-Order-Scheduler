import { useState, useEffect } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import OrderForm from '../components/order/order_form';
import { OrderFormContext } from '../services/order_form_context';
import { useCreate, Usedelete, useFetch, useUpdate } from '../services/use_service';
import Table from '../components/table';

const Orders = () => {

    const [orders, setOrders] = useState([]);

    const [toast, setToast] = useState({
        severity: 'success',
        message: '',
        isOpen: false
    });

    // Form state
    const [formData, setFormData] = useState({
        orderNo: generateOrderNo(),
        styleName: '',
        quantity: '',
        deliveryDate: dayjs().add(7, 'day'), // Default to 1 week from today
        unitId: '',
        lineIds: [],
        shiftId: ''
    });

    const [currentOrder, setCurrentOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const columns = [
        {
            title: 'Order No',
            dataIndex: 'orderNo',
            key: 'orderNo',
            minWidth: 150
        },
        {
            title: 'Style Name',
            dataIndex: 'styleName',
            key: 'styleName',
            minWidth: 150
        },
        {
            title: 'Quanity',
            dataIndex: 'quantity',
            key: 'quantity',
            minWidth: 150
        },
        {
            title: 'Delivery Date',
            dataIndex: 'delivery_date',
            key: 'name',
            minWidth: 150
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            minWidth: 150
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            key: 'shift',
            minWidth: 150
        },
    ]
    function generateOrderNo() {
        const lastOrderNo = orders.length > 0
            ? parseInt(orders[orders.length - 1].orderNo.split('-')[1])
            : 0;
        return `ORD-${String(lastOrderNo + 1).padStart(3, '0')}`;
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            ...formData,
            deliveryDate: formData.deliveryDate.format('YYYY-MM-DD')
        };

        if (currentOrder) {
            await useUpdate(currentOrder.id, formData, "orders");
            setToast({
                severity: 'success',
                message: 'Order updated successfully',
                isOpen: true
            });
        } else {
            await useCreate(formData, "orders");
            setToast({
                severity: 'success',
                message: 'Order Created successfully',
                isOpen: true
            });
        }
        fetchOrdres()
        setFormData({
            orderNo: generateOrderNo(),
            styleName: '',
            quantity: '',
            deliveryDate: dayjs().add(7, 'day'),
            unitId: '',
            lineIds: [],
            shiftId: ''
        });
        setCurrentOrder(null);
        setOpenModal(false);
    };

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setFormData({
            ...order,
            deliveryDate: dayjs(order.deliveryDate)
        });
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        await Usedelete(id, "units");
        fetchOrdres()
        setToast({
            severity: 'success',
            message: 'Unit deleted successfully',
            isOpen: true
        });
    };

    const handleClose = () => {
        setOpenModal(false)
    }
    const handleCreateOrder = () => {
        setFormData({ orderNo: generateOrderNo() })
        setOpenModal(true)
    }
    const fetchOrdres = async () => {
        try {
            const fetchedOrders = await useFetch("orders");
            setOrders(fetchedOrders || []); // Ensure we always have an array
        } catch (error) {
            console.error('Error fetching units:', error);
            setOrders([]);
        }
    };

    useEffect(() => {
        fetchOrdres();
    }, []);

    return (
        <div>
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

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5">Order Creation</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateOrder}
                    >
                        Create Order
                    </Button>
                </Box>

                <Table
                    columns={columns}
                    dataSource={orders}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <Dialog
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setCurrentOrder(null);
                    }}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>
                        {currentOrder ? 'Edit Order' : 'Create New Order'}
                    </DialogTitle>
                    <OrderFormContext.Provider value={{ handleSubmit, formData, handleInputChange, handleClose, currentOrder, setFormData, handleClose }}>
                        <OrderForm />
                    </OrderFormContext.Provider>
                </Dialog>
            </Container>
        </div>
    );
};

export default Orders;