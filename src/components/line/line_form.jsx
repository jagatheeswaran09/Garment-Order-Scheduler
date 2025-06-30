import { Button, DialogActions, DialogContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFetch } from '../../services/use_service';

const LineForm = ({ handleSubmit, formData, handleInputChange, handleCloseModal, currentUnit }) => {
    const [Lines, setLines] = useState([]); // Initialize as empty array

    const fetchLines = async () => {
        try {
            const fetchedLines = await useFetch("units");
            setLines(fetchedLines || []); // Ensure we always have an array
        } catch (error) {
            setLines([]);
        }
    };

    useEffect(() => {
        fetchLines();
    }, []);
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ m: 2, minWidth: 80 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Unit</InputLabel>
                                <Select
                                    label="Unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    displayEmpty
                                >
                                    {Lines.map((item) => {
                                        return (
                                            <MenuItem value={item.id}>{item?.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl >
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {currentUnit ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </div>
    )
}

export default LineForm
