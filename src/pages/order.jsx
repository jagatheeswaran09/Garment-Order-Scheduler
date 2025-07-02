import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import OrderForm from "../components/order/order_form";
import { OrderFormContext } from "../services/order_form_context";
import {
  useCreate,
  Usedelete,
  useFetch,
  useUpdate,
} from "../services/use_service";
import Table from "../components/table";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [toast, setToast] = useState({
    severity: "success",
    message: "",
    isOpen: false,
  });

  // Form state
  const [formData, setFormData] = useState({});

  const [currentOrder, setCurrentOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    {
      title: "Order No",
      dataIndex: "orderNo",
      key: "orderNo",
      minWidth: 150,
    },
    {
      title: "Style Name",
      dataIndex: "styleName",
      key: "styleName",
      minWidth: 150,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      minWidth: 150,
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      key: "name",
      minWidth: 150,
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Unit",
      dataIndex: "UnitName",
      key: "unit",
      minWidth: 150,
    },
    {
      title: "Shift",
      dataIndex: "shiftName",
      key: "shift",
      minWidth: 150,
    },
  ];
  function generateOrderNo() {
    const lastOrderNo =
      orders.length > 0
        ? parseInt(orders[orders.length - 1].orderNo.split("-")[1])
        : 0;
    return `ORD-${String(lastOrderNo + 1).padStart(3, "0")}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentOrder) {
      await useUpdate(currentOrder.id, formData, "orders");
      setToast({
        severity: "success",
        message: "Order updated successfully",
        isOpen: true,
      });
    } else {
      await useCreate(formData, "orders");
      setToast({
        severity: "success",
        message: "Order Created successfully",
        isOpen: true,
      });
    }
    fetchOrders();
    setCurrentOrder(null);
    setOpenModal(false);
  };

  const handleEdit = (order) => {
    setCurrentOrder(order);
    setFormData({
      ...order,
      deliveryDate: dayjs(order.deliveryDate),
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    await Usedelete(id, "orders");
    fetchOrders();
    setToast({
      severity: "success",
      message: "Unit deleted successfully",
      isOpen: true,
    });
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await useFetch("orders");
      setOrders(fetchedOrders || []); // Ensure we always have an array
    } catch (error) {
      console.error("Error fetching units:", error);
      setOrders([]);
    }
  };

  const handleCreateOrder = () => {
    setFormData({ orderNo: generateOrderNo() });
    setOpenModal(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
            {currentOrder ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <OrderFormContext.Provider
            value={{
              handleSubmit,
              formData,
              handleInputChange,
              handleClose,
              currentOrder,
              setFormData,
            }}
          >
            <OrderForm />
          </OrderFormContext.Provider>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Orders;
