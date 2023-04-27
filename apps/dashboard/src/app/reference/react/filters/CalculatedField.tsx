import {
    applyJsonLogic, pasteToClipboard
} from "@ezgrid/grid-core";
import { callChatGpt, openChatGpt } from "@ezgrid/grid-react";
import { Close } from "@mui/icons-material";
import { AppBar, IconButton, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FC, useState } from "react";

export interface CalculatedFieldEditorProps {
    allFields: string[];
    onClose: () => void;
}

const formulaUserPlaceHolder = `Please type a prompt here for ChatGPT to generate a formula.
Example: If the fields are: firstName, lastName, product, price, quantity, inStock.
Below are some examples of the prompts you can enter, and what Chat GPT will generate.
1) If inStock, return In Stock else Out of Stock : {"if" : [{"var" : "inStock"}, "In Stock", "Out of Stock"]}
2) Concatenate firstName and lastName :  {"cat" : [{"var" : "firstName"}, " ", {"var" : "lastName"}]}
3) Calculate sales tax : {"*" : [{"var" : "price"}, 0.08]}
4) Calculate total price : {"*" : [{"var" : "price"}, {"var" : "quantity"}]}
5) Calculate total price with sales tax : {"+" : [{"*" : [{"var" : "price"}, {"var" : "quantity"}]}, {"*" : [{"var" : "price"}, {"var" : "quantity"}, 0.08]}]}
`
const formulaChatGptPrompt = `You are creating a formula for a calculated field. 
The values for the operator can be >,>=,<,<=,between,max,min,+,-,*,/,%,if,==,===,!=,!==,!,!!,or,and,cat,in,substr,map,reduce,filter,all,none,some,merge,in
If the fields are: firstName, lastName, product, price, quantity, inStock.
Below is how you respond to the question.
1) If inStock, return In Stock else Out of Stock : {"if" : [{"var" : "inStock"}, "In Stock", "Out of Stock"]}
2) Concatenate firstName and lastName :  {"cat" : [{"var" : "firstName"}, " ", {"var" : "lastName"}]}
3) Calculate sales tax : {"*" : [{"var" : "price"}, 0.08]}
4) Calculate total price : {"*" : [{"var" : "price"}, {"var" : "quantity"}]}
5) Calculate total price with sales tax : {"+" : [{"*" : [{"var" : "price"}, {"var" : "quantity"}]}, {"*" : [{"var" : "price"}, {"var" : "quantity"}, 0.08]}]}
`
const formulaTestPlaceHolder = `Test your formula here. Paste some sample JSON and click on evaulate. E.g. for example 3,4 or 5 above would enter
{ "price" : 25, "quantity" : 2}
`
const chatGptResponsePlaceHolder = `Paste the response from ChatGPT or type the formula here. E.g. for example 3 you would paste or type {"*" : [{"var" : "price"}, 0.08]}`
export const CalculatedFieldEditor: FC<CalculatedFieldEditorProps> = ({ allFields, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [chatGptQuestion, setChatGptQuestion] = useState("");
    const [chatGptResponse, setChatGptResponse] = useState("");
    const [sampleData, setSampleData] = useState("");
    const getChatGptPrompt = () => `${formulaChatGptPrompt}
    Fields: ${allFields.filter(f => chatGptQuestion.indexOf(f) >= 0).join(", ")}
    Question: ${chatGptQuestion}
    Please only return the formula, nothing else, no line breaks.
    `
    return (
        <div>
            <Dialog open={true} onClose={onClose} fullScreen>

            {loading && <div className="ezgrid-dg-loading-message">Loading...</div>}
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
                    <Stack sx={{ display: "flex", gap: "15px" }}>
                        You can use this form to generate a formula for a calculated field. You can either type the formula or use Chat GPT to generate the formula.
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "5px" }}>
                            <Typography>1) Choose fields that you want to inclulde in the formula</Typography>
                            <Select onChange={(e) => {
                                const val = e.target.value as string;
                                setChatGptQuestion(chatGptQuestion + " " + val);
                            }}>
                                {
                                    allFields.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)
                                }
                            </Select>
                            <Typography>2) If you want to use ChatGPT, enter in simple english logic you wish to use. Please review the examples in the box. If you do not want to use Chat GPT, you can
                                proceed to step 4.
                            </Typography>
                            <TextField value={chatGptQuestion} multiline rows={8} onChange={(e) => {
                                setChatGptQuestion(e.target.value);
                            }} placeholder={formulaUserPlaceHolder} />


                            <Typography>3) Use Chat GPT to make forumla </Typography>
                            <Stack>
                                Use the Copy prompt button which will open ChatGPT in a new window.
                                Once Chat GPT returns the formula, paste it using the Paste Chat GPT Button.
                                If you have an Open AI key, you can directly click the Ask ChatGPT button
                                <div className="ezgrid-dg-toolbar-section" style={{ justifyContent: "center" }} >

                                    <Button onClick={async () => {
                                        await pasteToClipboard(getChatGptPrompt());
                                        openChatGpt();
                                    }}>Copy GPT Prompt</Button>
                                    <Button onClick={() => {
                                        const chatGptResponse = prompt("Paste Chat GPT response here");
                                        if (!chatGptResponse) return;
                                        setChatGptResponse(chatGptResponse);
                                    }}>Paste ChatGPT Response</Button>
                                    <Button onClick={async () => {
                                        setLoading(true);
                                        const result = await callChatGpt(getChatGptPrompt());
                                        setChatGptResponse(result);
                                        setLoading(false);
                                    }}>Ask Chat GPT</Button>
                                </div>
                            </Stack>

                            <Typography>4) Once you have the formula from Chat GPT, or if you built it manually, you can type it in here </Typography>
                            <TextField placeholder={chatGptResponsePlaceHolder} fullWidth value={chatGptResponse} onChange={(e) => {
                                setChatGptResponse(e.target.value);
                            }} ></TextField>
                            <Typography>5) Test your formula (optional) </Typography>
                            <Stack>
                                <TextField placeholder={formulaTestPlaceHolder} value={sampleData} onChange={(e) => {
                                    setSampleData(e.target.value);
                                }} fullWidth multiline rows={2}></TextField>

                                <div className="ezgrid-dg-toolbar-section" style={{ justifyContent: "center" }} >
                                    <Button onClick={() => {
                                        const result = applyJsonLogic(JSON.parse(chatGptResponse), JSON.parse(sampleData));
                                        alert(result);
                                    }}>Test Formula</Button>
                                <Button onClick={async () => {
                                    const sampleData: any = {};
                                    for (const fld of allFields) {
                                        if (chatGptQuestion.indexOf(fld) > 0) {
                                            sampleData[fld] = "";
                                        }
                                    }
                                    setSampleData(JSON.stringify(sampleData));

                                }}>Generate Sample Json</Button>

                             </div>
                        </Stack>
                    </div>
                    </Stack>

                    <DialogActions>
                        <Button onClick={async () => {
                            await pasteToClipboard(`json:${chatGptResponse}`);
                        }}>Copy DataField</Button>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div >
    );
};
