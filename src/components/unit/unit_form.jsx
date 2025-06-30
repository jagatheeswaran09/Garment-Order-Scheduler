import { Button, DialogActions, DialogContent, Grid, TextField } from '@mui/material'
import React from 'react'

const UnitForm = ({ handleSubmit, formData, handleInputChange, handleCloseModal, currentUnit }) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Unit Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                margin="normal"
                            />
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

export default UnitForm
