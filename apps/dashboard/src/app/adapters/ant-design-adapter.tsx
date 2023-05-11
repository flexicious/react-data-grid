import { CaretLeftOutlined, CaretRightOutlined, CloseCircleOutlined, DeleteOutlined, DownCircleFilled, DownCircleOutlined, EditOutlined,CheckCircleOutlined, FileExcelOutlined, FilePdfOutlined, FilterFilled, FilterOutlined, MinusCircleOutlined, PlusCircleOutlined, SaveOutlined, SettingOutlined, StepBackwardOutlined, StepForwardOutlined, TableOutlined, UndoOutlined, UpCircleFilled, UpCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { CheckBoxState, GridCheckBoxProps, GridIconButton, GridMenuProps, LibraryAdapter, VirtualTreeNode } from "@ezgrid/grid-core";
import dayjs from "dayjs";

import { Button, Checkbox, DatePicker, Divider, Input, List, Select } from "antd";
import { createElement, ReactNode } from "react";
export const generateIcon = (icon: ReactNode, { onClick, disabled, title, className }: any) => <Button
 color="primary" key={className} size="small" onClick={onClick} disabled={disabled} title={title} icon={icon}>
</Button>;


export const antAdapter: LibraryAdapter = {
    createElementFromNode: (node: VirtualTreeNode, props: Record<string, unknown>, children: unknown): unknown => {
        let propsToApply = props;
        if ((node.key).indexOf("remove-circle-icon") >= 0) {
            return generateIcon(<MinusCircleOutlined />, props);
        } else if ((node.key).indexOf("add-circle-icon") >= 0) {
            return generateIcon(<PlusCircleOutlined />, props);
        } else if ((node.key).indexOf("expand-one-icon") >= 0) {
            return generateIcon(<RightCircleOutlined />, props);
        } else if ((node.key).indexOf("collapse-one-icon") >= 0) {
            return generateIcon(<DownCircleOutlined />, props);
        }
        return createElement("div", propsToApply, children as string | (ReactNode | ReactNode[])[]);
    },
    createSelectField: (props): unknown => {
        const { onChange,  style, options, value, fullWidth } = props;
        if (options?.length === 0) return null;
        const styles = { width: fullWidth ? "100%" : "auto", ...style };
        return <Select onChange={(e) => {
            onChange?.(e);
        }} style={styles} /* ref={ref as Ref<any>} */ value={value} >
            {(options || []).map((option) => <Select.Option key={option.value} value={option.value} >{option.name}</Select.Option>)}
        </Select >;
    },
    createDateField: (props): unknown => {
        const { onChange, value } = props;
        return <DatePicker 
        value={dayjs(value)} 
        onChange={(dt)=>{onChange?.(dt?.toDate());}} 
         />;
    },
    createTextField: (props): unknown => {
        const { onChange, placeholder, onKeyDown,  style, readOnly, onClick, value, defaultValue } = props;
        return <Input value={value} defaultValue={defaultValue} onClick={onClick} onChange={(e) => {
            onChange?.(e.target.value);
        }} onKeyDown={onKeyDown} readOnly={readOnly} placeholder={placeholder} style={style}
         /* ref={ref as Ref<any>} */ />;
    },
    createTextArea : (props): unknown => {
        const { onChange, placeholder, onKeyDown,  style, readOnly, onClick, value, defaultValue } = props;
        return <Input.TextArea value={value} defaultValue={defaultValue} onClick={onClick} onChange={(e) => {
            onChange?.(e.target.value);
        }} onKeyDown={onKeyDown} readOnly={readOnly} placeholder={placeholder} style={style}
         /* ref={ref as Ref<any>} */ />;
    },
    createCheckBox: (props: GridCheckBoxProps) => {
        const { onChange, value } = props;
        return <Checkbox /* ref={ref as Ref<HTMLInputElement>} */ onChange={(e) => { onChange?.(e.target.checked); }}
         checked={value === true} />;
    },
    createMenu: (props: GridMenuProps)=> {
        const { options } = props;
        const cell = {rowIdentifier: props.rowPosition?.uniqueIdentifier ||"", 
            columnIdentifier: props.columnPosition?.column?.uniqueIdentifier || ""};
        return <div>
            
        <style>
            {`.ant-list-item:hover {
                background-color: #efefef;
            }`}
        </style>
        <List key="menu" style={{backgroundColor:"white"}}>
        {options?.map((item,idx) =>item? <List.Item style={{cursor:"pointer"}} key={idx} onClick={()=>item.onClick(cell)}>{item.label as ReactNode}</List.Item>:
         <Divider key={idx} type="horizontal"  style={{height:"4px", margin:"0px"}}/> )}
    </List></div>;
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
            />;
    },
    createIconButton: (icon: GridIconButton, { props }): unknown => {

        if (icon === GridIconButton.PageFirst) {
            return generateIcon(<StepBackwardOutlined />, props);
        } else if (icon === GridIconButton.PagePrevious) {
            return generateIcon(<CaretLeftOutlined />, props);
        } else if (icon === GridIconButton.PageNext) {
            return generateIcon(<CaretRightOutlined />, props);
        } else if (icon === GridIconButton.PageLast) {
            return generateIcon(<StepForwardOutlined />, props);
        } else if (icon === GridIconButton.Settings) {
            return generateIcon(<SettingOutlined />, props);
        } else if (icon === GridIconButton.SettingsSave) {
            return generateIcon(<SaveOutlined />, props);
        } else if (icon === GridIconButton.FilterBuilder) {
            return generateIcon(<FilterOutlined />, props);
        } else if (icon === GridIconButton.SettingsManage) {
            return generateIcon(<TableOutlined />, props);
        } else if (icon === GridIconButton.ExpandOne) {
            return generateIcon(<DownCircleOutlined />, props);
        } else if (icon === GridIconButton.ExpandAll) {
            return generateIcon(<DownCircleFilled />, props);
        } else if (icon === GridIconButton.CollapseOne) {
            return generateIcon(<UpCircleOutlined />, props);
        } else if (icon === GridIconButton.CollapseAll) {
            return generateIcon(<UpCircleFilled />, props);
        } else if (icon === GridIconButton.Pdf) {
            return generateIcon(<FilePdfOutlined />, props);
        } else if (icon === GridIconButton.Excel) {
            return generateIcon(<FileExcelOutlined />, props);
        } else if (icon === GridIconButton.Cancel) {
            return generateIcon(<CloseCircleOutlined />, props);
        } else if (icon === GridIconButton.Reset) {
            return generateIcon(<UndoOutlined />, props);
        } else if (icon === GridIconButton.Delete) {
            return generateIcon(<DeleteOutlined />, props);
        } else if (icon === GridIconButton.Ok || icon === GridIconButton.Apply) {
            return generateIcon(<CheckCircleOutlined />, props);
        } else if (icon === GridIconButton.Filter) {
            return generateIcon(<FilterFilled />, props);
        } else if (icon === GridIconButton.Edit) {
            return generateIcon(<EditOutlined />, props);
        } else if (icon === GridIconButton.Plus) {
            return generateIcon(<PlusCircleOutlined />, props);
        } else if (icon === GridIconButton.Minus) {
            return generateIcon(<MinusCircleOutlined />, props);
        }

        return { props };
    }
};
