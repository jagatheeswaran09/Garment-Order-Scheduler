import React from 'react'
import UnitFormList from './unit_form_list';
import ShiftFormList from './shift_form_list';
import LineFormList from './line_form_list';
import { Button, DialogActions, DialogContent, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useOrderForm } from '../../services/order_form_context';

const OrderForm = () => {
    const { handleSubmit, formData, handleInputChange, handleClose, currentOrder, setFormData } = useOrderForm()
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order No"
                                name="orderNo"
                                value={formData?.orderNo}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Style Name"
                                name="styleName"
                                value={formData?.styleName}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={formData?.quantity}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Delivery Date"
                                value={formData?.deliveryDate}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, deliveryDate: newValue })
                                }
                                minDate={dayjs().add(1, 'day')}
                                shouldDisableDate={(date) => {
                                    const day = date.day();
                                    return day === 0 || day === 6;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} margin="normal" required />
                                )}
                                format='DD/MM/YYYY'
                            />
                        </Grid>
                        <UnitFormList />
                        <ShiftFormList />
                        <LineFormList />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {currentOrder ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </div>
    )
}

export default OrderForm
