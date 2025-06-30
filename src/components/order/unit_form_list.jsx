

import React, { useEffect, useState } from 'react'
import { useFetch } from '../../services/use_service';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useOrderForm } from '../../services/order_form_context';

const UnitFormList = () => {
    const { formData, handleInputChange, } = useOrderForm()
    const [Units, setUnits] = useState([]);

    const fetchUnits = async () => {
        try {
            const fetchedUnits = await useFetch("units");
            setUnits(fetchedUnits || []); // Ensure we always have an array
        } catch (error) {
            setUnits([]);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    return (
        <Grid item xs={12}>
            <FormControl sx={{ m: 2, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Units</InputLabel>
                <Select
                    label="Unit"
                    name="unit"
                    value={formData?.unit}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    displayEmpty
                >
                    {Units.map((item) => {
                        return (
                            <MenuItem value={item.id}>{item?.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl >
        </Grid>
    )
}

export default UnitFormList
