import { createColumn, createDragColumn, HorizontalScrollMode } from "@euxdt/grid-core";
import { ReactDataGrid } from "@euxdt/grid-react";
import { useState } from "react";
import SampleData from "../mockdata/SampleData";

export const DragDrop = () => {
    const [leftBooks, setLeftBooks] = useState<Record<string, any>[]>(SampleData.bookData.slice(0, 5));
    const [rightBooks, setRightBooks] = useState<Record<string, any>[]>(SampleData.bookData.slice(5, 10));

    const dragEnd = (dragFrom: string, dragTo: string) => {

        const dragFromGrid = leftBooks.find(b => b.id === dragFrom) ? leftBooks : rightBooks;
        const dragToGrid = leftBooks.find(b => b.id === dragTo) ? leftBooks : rightBooks;
        if (dragFromGrid === dragToGrid) {
            return true; //let the grid handle drag and drop
        } else {
            const book = dragFromGrid.find(b => b.id === dragFrom);
            if (book) {
                dragFromGrid.splice(dragFromGrid.indexOf(book), 1);
                const dragToIndex = dragToGrid.findIndex(b => b.id === dragTo);
                dragToGrid.splice(dragToIndex + 1, 0, book);
                setLeftBooks([...leftBooks]);
                setRightBooks([...rightBooks]);
            }

            return false; //we handled the drag and drop
        }


    };
    return <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
            <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
                dataProvider: leftBooks,
                horizontalScroll: HorizontalScrollMode.Off,
                enableFilters: false,
                enableHeightAutoAdjust: true,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columns: [
                    {
                        ...createDragColumn(),
                        dragOptions: {
                            dragEnd
                        }
                    },
                    createColumn("id", "number"),
                    createColumn("description", "string"),
                    createColumn("author", "string", "Author"),
                    createColumn("title", "string", "Title"),
                ]
            }}></ReactDataGrid>
        </div>
        <div style={{ flex: 1 }}>
            <ReactDataGrid style={{ height: "100%", width: "100%" }} gridOptions={{
                dataProvider: rightBooks,
                horizontalScroll: HorizontalScrollMode.Off,
                enableFilters: false,
                enableHeightAutoAdjust: true,
                uniqueIdentifierOptions: {
                    useField: "id"
                },
                columns: [
                    {
                        ...createDragColumn(),
                        dragOptions: {
                            dragEnd
                        }
                    },
                    createColumn("id", "number"),
                    createColumn("description", "string"),
                    createColumn("author", "string", "Author"),
                    createColumn("title", "string", "Title"),
                ]
            }}></ReactDataGrid>
        </div>
    </div>;
};