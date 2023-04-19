import { VirtualTreeNode, getApi } from "@euxdt/grid-core";

export const applyEditedValue = (node:VirtualTreeNode, value:unknown, rowsToEdit?:string[]) => {
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
};