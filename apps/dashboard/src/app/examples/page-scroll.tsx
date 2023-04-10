import { Button, Typography } from "@mui/material";


export const PageScroll = () => {
    //remove quotes around true and false
    return (
        <div style={{ width: "100%" }}>
            <Typography variant="h5" gutterBottom>Page Scroll</Typography>
            <Typography variant="body1" gutterBottom>
                The grid can be configured to use the window scroll bar to scroll the grid.
                This avoids the need for a scroll bar within the grid itself, so you dont have to have 
                multiple scroll bars on the page. The grid header will remain fixed at the top of the page below 
                a set configureable height, so you have space for your own fixed header. The footer will remain fixed at the bottom of the page
                so you can scroll horizontally without losing the footer. When you reach the bottom of the page and there is no more 
                data to display, the grid will scroll out of view allowing you to render your footer.

                To see this in action, click the button below

            </Typography>
            <Button variant="contained" onClick={() => {
                window.open("https://reactdatagrid.com/demo/page_scroll/index.html", "_blank");
            }}>Open Page Scroll Demo</Button>
        </div>
    );
};
