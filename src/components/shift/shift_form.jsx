import { Button, DialogActions, DialogContent, Grid, TextField } from '@mui/material'
import TimePickerComponent from '../time_picker';
import dayjs from 'dayjs';

const ShiftForm = ({ handleSubmit, formData, handleInputChange, handleCloseModal, currentShift }) => {
    console.log(formData)
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
                            <TimePickerComponent
                                label="Start Time"
                                defaultValue={`2022-04-17T${formData.start_time}`}
                                // defaultValue={dayjs( formData.start_time)}
                                onChange={handleInputChange}
                                name={"start_time"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TimePickerComponent
                                label="End Time"
                                // defaultValue={dayjs( formData.end_time)}
                                defaultValue={`2022-04-17T${formData.end_time}`}
                                onChange={handleInputChange}
                                name={"end_time"}
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
                        {currentShift ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </div>
    )
}

export default ShiftForm
