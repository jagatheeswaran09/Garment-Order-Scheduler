import React, { useEffect, useState } from "react";
import { useFetch } from "../../services/use_service";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useOrderForm } from "../../services/order_form_context";

const LineFormList = () => {
  const { formData, handleInputChange, setFormData } = useOrderForm();
  const [Lines, setLines] = useState([]);

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
      <FormControl sx={{  minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Line</InputLabel>
        <Select
          label="Unit"
          name="lineIds"
          value={formData?.lineIds}
          onChange={(e, value) => {
            handleInputChange(e);
            handleInputChange({
              target: { name: "LinName", value: value?.props.children },
            });
          }}
          margin="normal"
          required
          displayEmpty
        >
          {Lines.map((item) => {
            return <MenuItem value={item.id}>{item?.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default LineFormList;
