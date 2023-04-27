import { CheckBoxState, ElementProps, GridCheckBoxProps, GridIconButton, GridMenuProps, LibraryAdapter, resolveExpression, TreeNodeType, VirtualTreeNode } from "@ezgrid/grid-core";
import {
    AddCircle, ArrowBack, ArrowForward, Cancel, ChevronRight, ContentPaste, CopyAll, DeleteOutline, DoneOutline, Edit, ExpandLess, ExpandMore, FileDownload, FilterAlt, FilterList, FirstPage, GridView, LastPage, PictureAsPdf, RemoveCircle, RestartAlt, Save, Settings,
    UnfoldLess, UnfoldMore, Addchart, EditRoad
} from "@mui/icons-material";
import { Button, Checkbox, Divider, IconButton, List, MenuItem, Select, TextField, Theme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createElement, ReactNode, Ref } from "react";
import React from "react";

export const generateIcon = (icon: ReactNode, { onClick, disabled, title, className, style }: any, textAndIcon?: boolean) =>
    textAndIcon ? <Button color="primary" key={className} size="small" onClick={onClick} disabled={disabled} title={title} style={style} variant="outlined" startIcon={icon}>
        {title}
    </Button> :
        <IconButton color="primary" key={className} size="small" onClick={onClick} disabled={disabled} title={title} style={style}>
            {icon}
        </IconButton>;


export const materialNodePropsFunction = (theme: Theme) => (node: VirtualTreeNode, props: ElementProps) => {
    if (node.type === TreeNodeType.Grid) {
        return {
            ...props,
            style: {
                ...props.style,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }
        };
    } else if (node.type === TreeNodeType.Row) {
        if (props.className.indexOf("active-row") >= 0) {
            return {
                ...props,
                style: {
                    ...props.style,
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                }
            };
        } else if (props.className.indexOf("selected-row") >= 0) {
            return {
                ...props,
                style: {
                    ...props.style,
                    backgroundColor: theme.palette.action.focus,
                    color: theme.palette.text.primary,
                }
            };
        }
    } else if (node.type === TreeNodeType.Cell) {
        if (props.className.indexOf("active-cell") >= 0) {
            return {
                ...props,
                style: {
                    ...props.style,
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                }
            };
        } else if (props.className.indexOf("selected-cell") >= 0) {
            return {
                ...props,
                style: {
                    ...props.style,
                    backgroundColor: theme.palette.action.focus,
                    color: theme.palette.text.primary,
                }
            };
        }
    }
    return props;
};
export const materialAdapter: LibraryAdapter = {
    createElementFromNode: (node: VirtualTreeNode, props: Record<string, unknown>, children: unknown): unknown => {
        let propsToApply = props;
        if ((node.key).indexOf("remove-circle-icon") >= 0) {
            return generateIcon(<RemoveCircle />, props);
        } else if ((node.key).indexOf("add-circle-icon") >= 0) {
            return generateIcon(<AddCircle />, props);
        } else if ((node.key).indexOf("expand-one-icon") >= 0) {
            return generateIcon(<ChevronRight />, props);
        } else if ((node.key).indexOf("collapse-one-icon") >= 0) {
            return generateIcon(<ExpandMore />, props);
        }
        return createElement("div", propsToApply, children as string | (ReactNode | ReactNode[])[]);
    },
    createSelectField: (props): unknown => {
        const { onChange, ref, style, options, value, fullWidth } = props;
        if (options?.length === 0) return null;

        return <Select onChange={(e) => {
            onChange?.(e.target.value);
        }} style={style} inputRef={ref as Ref<any>} value={value} variant="standard" fullWidth={fullWidth === false ? false : true}>
            {(options || []).map((option) => <MenuItem key={option.value} value={option.value} >{option.name}</MenuItem>)}
        </Select >;
    },
    createDateField: (props): unknown => {
        const { onChange, value } = props;
        return <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={(newValue) => {
                    const oDate = resolveExpression(newValue, "$d");
                    onChange?.(oDate || newValue);
                }}
                renderInput={(params) => <TextField autoFocus {...params} variant="standard" />}
            />
        </LocalizationProvider>;
    },
    createTextField: (props): unknown => {
        const { onChange, placeholder, onKeyDown, ref, style, readOnly, onClick, value, defaultValue, attributes } = props;
        return <TextField value={value} defaultValue={defaultValue} onChange={(e) => {
            onChange?.(e.target.value);
        }} onKeyDown={onKeyDown} inputProps={{ readOnly, onClick, placeholder }} style={style} inputRef={ref as Ref<any>} variant="standard" {...attributes} />;
    },
    createTextArea: (props): unknown => {
        const { onChange, placeholder, onKeyDown, ref, style, readOnly, onClick, value, defaultValue, rows, attributes } = props;
        return <TextField value={value} defaultValue={defaultValue} onChange={(e) => {
            onChange?.(e.target.value);
        }} onKeyDown={onKeyDown} inputProps={{ readOnly, onClick, placeholder }} style={style} inputRef={ref as Ref<any>} variant="standard" multiline rows={rows || 4}  {...attributes} />;
    },
    createCheckBox: (props: GridCheckBoxProps) => {
        const { onChange, value, ref } = props;
        return <Checkbox inputRef={ref as Ref<HTMLInputElement>} onChange={(e, checked) => { onChange?.(checked); }} checked={value === true} />;
    },
    createMenu: (props: GridMenuProps) => {
        const { options } = props;
        const cell = {
            rowIdentifier: props.rowPosition?.uniqueIdentifier || "",
            columnIdentifier: props.columnPosition?.column?.uniqueIdentifier || ""
        };
        return <List key="menu">
            {options?.map((item, idx) => item ? <MenuItem key={idx} onClick={() => item.onClick(cell)}>{item.label as ReactNode}</MenuItem> : <Divider key={idx} />)}
        </List>;
    },
    createTriStateCheckbox: (props): unknown => {
        const { onChange, value, allowIndeterminate } = props;
        return <Checkbox onClick={(e) => {
            if (allowIndeterminate) {
                if (value === CheckBoxState.INDETERMINATE) {
                    onChange(CheckBoxState.CHECKED);
                } else if (value === CheckBoxState.UNCHECKED) {
                    onChange(CheckBoxState.INDETERMINATE);
                } else {
                    onChange(CheckBoxState.UNCHECKED);
                }
            } else {
                onChange(value !== CheckBoxState.CHECKED ? CheckBoxState.CHECKED : CheckBoxState.UNCHECKED);
            }
            e.stopPropagation();
        }}
            checked={value === CheckBoxState.INDETERMINATE ? false : value === CheckBoxState.CHECKED}
            indeterminate={value === CheckBoxState.INDETERMINATE}
            color="primary" />;
    },
    createIconButton: (icon: GridIconButton, { props }, textAndIcon?: boolean): unknown => {

        if (icon === GridIconButton.PageFirst) {
            return generateIcon(<FirstPage />, props, textAndIcon);
        } else if (icon === GridIconButton.PagePrevious) {
            return generateIcon(<ArrowBack />, props, textAndIcon);
        } else if (icon === GridIconButton.PageNext) {
            return generateIcon(<ArrowForward />, props, textAndIcon);
        } else if (icon === GridIconButton.PageLast) {
            return generateIcon(<LastPage />, props, textAndIcon);
        } else if (icon === GridIconButton.Settings) {
            return generateIcon(<Settings />, props, textAndIcon);
        } else if (icon === GridIconButton.SettingsSave) {
            return generateIcon(<Save />, props, textAndIcon);
        } else if (icon === GridIconButton.FilterBuilder) {
            return generateIcon(<FilterList />, props, textAndIcon);
        } else if (icon === GridIconButton.ChartBuilder) {
            return generateIcon(<Addchart />, props, textAndIcon);
        } else if (icon === GridIconButton.SettingsManage) {
            return generateIcon(<GridView />, props, textAndIcon);
        } else if (icon === GridIconButton.ExpandOne) {
            return generateIcon(<ExpandMore />, props, textAndIcon);
        } else if (icon === GridIconButton.ExpandAll) {
            return generateIcon(<UnfoldMore />, props, textAndIcon);
        } else if (icon === GridIconButton.CollapseOne) {
            return generateIcon(<ExpandLess />, props, textAndIcon);
        } else if (icon === GridIconButton.CollapseAll) {
            return generateIcon(<UnfoldLess />, props, textAndIcon);
        } else if (icon === GridIconButton.Pdf) {
            return generateIcon(<PictureAsPdf />, props, textAndIcon);
        } else if (icon === GridIconButton.Excel) {
            return generateIcon(<FileDownload />, props, textAndIcon);
        } else if (icon === GridIconButton.Cancel) {
            return generateIcon(<Cancel />, props, textAndIcon);
        } else if (icon === GridIconButton.Reset) {
            return generateIcon(<RestartAlt />, props, textAndIcon);
        } else if (icon === GridIconButton.Delete) {
            return generateIcon(<DeleteOutline />, props, textAndIcon);
        } else if (icon === GridIconButton.Ok || icon === GridIconButton.Apply) {
            return generateIcon(<DoneOutline />, props, textAndIcon);
        } else if (icon === GridIconButton.Filter) {
            return generateIcon(<FilterAlt />, props, textAndIcon);
        } else if (icon === GridIconButton.Edit) {
            return generateIcon(<Edit />, props, textAndIcon);
        } else if (icon === GridIconButton.BulkEdit) {
            return generateIcon(<EditRoad />, props, textAndIcon);
        } else if (icon === GridIconButton.Plus) {
            return generateIcon(<AddCircle />, props, textAndIcon);
        } else if (icon === GridIconButton.Minus) {
            return generateIcon(<RemoveCircle />, props, textAndIcon);
        } else if (icon === GridIconButton.Copy) {
            return generateIcon(<CopyAll />, props, textAndIcon);
        } else if (icon === GridIconButton.Paste) {
            return generateIcon(<ContentPaste />, props, textAndIcon);
        }

        return { props };
    }
};
