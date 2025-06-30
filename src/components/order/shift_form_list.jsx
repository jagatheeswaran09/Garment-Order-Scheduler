

import React, { useEffect, useState } from 'react'
import { useFetch } from '../../services/use_service';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useOrderForm } from '../../services/order_form_context';

const ShiftFormList = () => {
        const { formData, handleInputChange } = useOrderForm()
    
    const [Shifts, setShift] = useState([]); // Initialize as empty array

    const fetchShifts = async () => {
        try {
            const fetchedShifts = await useFetch("shifts");
            setShift(fetchedShifts || []); // Ensure we always have an array
        } catch (error) {
            setShift([]);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    return (
        <Grid item xs={12}>
            <FormControl sx={{ m: 2, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Shift</InputLabel>
                <Select
                    label="Unit"
                    name="unit"
                    value={formData?.shift}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    displayEmpty
                >
                    {Shifts.map((item) => {
                        return (
                            <MenuItem value={item.id}>{item?.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl >
        </Grid>
    )
}

export default ShiftFormList
