import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { muiAdapter } from "@ezgrid/grid-adapter-mui";
import React from "react";
import { GridDateInputElementProps, resolveExpression } from "@ezgrid/grid-core";

export const getMuiAdapter = () => muiAdapter(
    {
        createDateField: ({value, onChange}:GridDateInputElementProps) => <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={(newValue) => {
                    const oDate = resolveExpression(newValue, "$d");
                    onChange?.(oDate || newValue);
                }}
                renderInput={(params) => <TextField autoFocus {...params} variant="standard" />}
            />
        </LocalizationProvider>
    }
)