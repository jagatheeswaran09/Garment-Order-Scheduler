import React, { useEffect, useState } from 'react'
import { useFetch } from '../../services/use_service';
import { Autocomplete, Chip, Grid, TextField } from '@mui/material';
import { useOrderForm } from '../../services/order_form_context';

const LineFormList = () => {
    const { formData, handleInputChange, setFormData } = useOrderForm()
    const [Lines, setLines] = useState([]);
    const filteredLines = formData?.unitId
        ? Lines.filter(line => line.unitId === formData.unitId)
        : Lines;

    const fetchLines = async () => {
        try {
            const fetchedLines = await useFetch("lines");
            setLines(fetchedLines || []);
        } catch (error) {
            setLines([]);
        }
    };

    useEffect(() => {
        fetchLines();
    }, []);

    return (
        <Grid item xs={12}>
            <Autocomplete
                multiple
                options={filteredLines}
                getOptionLabel={(option) => option.name || ''}
                value={filteredLines.filter(line => 
                    formData?.lineIds?.includes(line.id) || false
                )}
                onChange={(e, newValue) => {
                    setFormData({
                        ...formData,
                        lineIds: newValue.map(line => line.id)
                    });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Lines Required"
                        placeholder="Select lines"
                        margin="normal"
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            key={option.id}
                        />
                    ))
                }
            />
        </Grid>
    )
}

export default LineFormList