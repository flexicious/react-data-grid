import { VirtualTreeNode, getApi } from "@ezgrid/grid-core";

export const applyEditedValue = (node:VirtualTreeNode, value:unknown, rowsToEdit?:string[], dispatchCommit?:boolean) => {
    const api = getApi(node);
    if(rowsToEdit && rowsToEdit.length){
        rowsToEdit.forEach(rowId=>{
            const row = api.getRowPosition(rowId);
            if(row)
            api.addChange(row, node.columnPosition!, value);
        });
        api.clearSelection();
    }
    else{
        api.addChange(node.rowPosition!, node.columnPosition!, value);
    }
    if(dispatchCommit){
        api.dispatchValueCommit();
    }
};