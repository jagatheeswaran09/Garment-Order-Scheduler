import React, { useState } from 'react';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

const TimePickerComponent = ({ label, defaultValue, onChange, name }) => {
    const [value, setValue] = useState(dayjs(defaultValue));

    const handleChange = (newValue) => {
        setValue(newValue);
        if (onChange) {
            let value = {
                target: {
                    name: name,
                    value: newValue.format('HH:mm')
                }
            }
            onChange(value); // Format as "15:30"
        }
    };

    return (
        <DemoItem label={label}>
            <MobileTimePicker
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                ampm={false} // Use 24-hour format
            />
        </DemoItem>
    );
};

export default TimePickerComponent;