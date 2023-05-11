import { CalculatedFieldEditor, CalculatedFieldEditorProps } from "@ezgrid/grid-react";
import Close from "@mui/icons-material/Close";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FC } from "react";

export const CalculatedFieldEditorWrapper: FC<CalculatedFieldEditorProps> = ({ allFields, onClose,gridOptions }) => {
    return (
        <div>
            <Dialog open={true} onClose={onClose} fullScreen>

                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flexGrow: 1 }} variant="h6" component="div">
                            Generate Calculation Expression
                        </Typography>

                        <DialogActions>
                            <Button color="inherit" onClick={onClose}>Close</Button>
                        </DialogActions>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <CalculatedFieldEditor allFields={allFields} gridOptions={gridOptions} />
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div >
    );
};
