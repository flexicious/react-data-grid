import {
    GridIconButton,
    LibraryAdapter,
    applyJsonLogic, pasteToClipboard
} from "@ezgrid/grid-core";
import { buttonCreator, callChatGpt, createSelectField, createTextArea, createTextField, openChatGpt } from "@ezgrid/grid-react";
import { FC, useEffect, useState } from "react";

export interface CalculatedFieldEditorProps {
    allFields: string[];
    onClose?: () => void;
    onFormulaChange?: (formula: string) => void;
    gridOptions: { adapter?: LibraryAdapter };
    formula?: string;
}

const formulaUserPlaceHolder = `Please type a prompt here for ChatGPT to generate a formula.
Example: If the fields are: firstName, lastName, product, price, quantity, inStock.
Below are some examples of the prompts you can enter, and what Chat GPT will generate.
1) If inStock, return In Stock else Out of Stock : {"if" : [{"var" : "inStock"}, "In Stock", "Out of Stock"]}
2) Concatenate firstName and lastName :  {"cat" : [{"var" : "firstName"}, " ", {"var" : "lastName"}]}
3) Calculate sales tax : {"*" : [{"var" : "price"}, 0.08]}
4) Calculate total price : {"*" : [{"var" : "price"}, {"var" : "quantity"}]}
5) Calculate total price with sales tax : {"+" : [{"*" : [{"var" : "price"}, {"var" : "quantity"}]}, {"*" : [{"var" : "price"}, {"var" : "quantity"}, 0.08]}]}
Available operators:>,>=,<,<=,between,max,min,+,-,*,/,%,if,==,===,!=,!==,!,!!,or,and,cat,in,substr,map,reduce,filter,all,none,some,merge,in
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



export const CalculatedFieldEditor: FC<CalculatedFieldEditorProps> = ({ allFields, onFormulaChange, gridOptions,formula }) => {
    const [loading, setLoading] = useState(false);
    const [chatGptQuestion, setChatGptQuestion] = useState("");
    const [chatGptResponse, setChatGptResponse] = useState("");
    const [sampleData, setSampleData] = useState("");
    const getChatGptPrompt = () => `${formulaChatGptPrompt}
    Fields: ${allFields.filter(f => chatGptQuestion.indexOf(f) >= 0).join(", ")}
    Question: ${chatGptQuestion}
    Please only return the formula, nothing else, no line breaks.
    `;
    useEffect(() => {
        if (onFormulaChange) {
            onFormulaChange(chatGptResponse);
        }
    }, [chatGptResponse]);
    useEffect(() => {
        if (formula) {
            setChatGptResponse(formula);
        }
    }, [formula]);
    return (
        <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
            {loading && <div className="ezgrid-dg-loading-message">Loading...</div>}
            You can use this form to generate a formula for a calculated field. You can either type the formula or use Chat GPT to generate the formula.
            <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "15px" }}>
                <div>1) Choose fields that you want to inclulde in the formula</div>

                {
                    createSelectField(gridOptions, {
                        options: allFields.map((f) => ({ value: f, name: f })),
                        onChange: (e) => {
                            setChatGptQuestion(chatGptQuestion + " " + e);
                        }
                    })
                }
                <div>2) If you want to use ChatGPT, enter in simple english logic you wish to use. Please review the examples in the box. If you do not want to use Chat GPT, you can
                    proceed to step 4.
                </div>
                {
                    createTextArea(gridOptions, {
                        value: chatGptQuestion,
                        onChange: setChatGptQuestion,
                        placeholder: formulaUserPlaceHolder,
                        rows: 9,
                        attributes: { rows: 9 }
                    })
                }


                <div>3) Use Chat GPT to make forumla </div>
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                    Use the Copy prompt button which will open ChatGPT in a new window.
                    Once Chat GPT returns the formula, paste it using the Paste Chat GPT Button.
                    If you have an Open AI key, you can directly click the Ask ChatGPT button
                    <div className="ezgrid-dg-toolbar-section" style={{ justifyContent: "center" }} >
                        {
                            buttonCreator({ gridOptions }, "copy-icon", "Copy GPT Prompt", async () => {
                                await pasteToClipboard(getChatGptPrompt());
                                openChatGpt();
                            }, GridIconButton.Copy, false, true)
                        }

                        {
                            buttonCreator({ gridOptions }, "paste-icon", "Paste ChatGPT Response", () => {
                                const chatGptResponse = prompt("Paste Chat GPT response here");
                                if (!chatGptResponse) return;
                                setChatGptResponse(chatGptResponse);
                            }
                                , GridIconButton.Paste, false, true)
                        }
                        {
                            buttonCreator({ gridOptions }, "page-next-icon", "Ask Chat GPT", async () => {
                                setLoading(true);
                                const result = await callChatGpt(getChatGptPrompt());
                                setChatGptResponse(result);
                                setLoading(false);
                            }, GridIconButton.PageNext, false, true)
                        }
                    </div>
                </div>

                <div>4) Once you have the formula from Chat GPT, or if you built it manually, you can type it in here </div>

                {
                    createTextField(gridOptions, {
                        placeholder: chatGptResponsePlaceHolder,
                        value: chatGptResponse,
                        onChange: setChatGptResponse,
                        attributes: { fullWidth: true }
                    })
                }
                <div>5) Test your formula (optional) </div>
                <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>

                    {
                        createTextArea(gridOptions, {
                            placeholder: formulaTestPlaceHolder,
                            value: sampleData,
                            onChange: setSampleData,
                            attributes: { fullWidth: true, rows: 2 }
                        })
                    }

                    <div className="ezgrid-dg-toolbar-section" style={{ justifyContent: "center" }} >
                        {
                            buttonCreator({ gridOptions }, "page-next-icon", "Generate Sample Json", async () => {
                                const sampleData: any = {};
                                for (const fld of allFields) {
                                    if (chatGptQuestion.indexOf(fld) > 0) {
                                        sampleData[fld] = "";
                                    }
                                }
                                setSampleData(JSON.stringify(sampleData));

                            }, GridIconButton.PageNext, false, true)
                        }

                        {
                            buttonCreator({ gridOptions }, "check-icon", "Test Formula", () => {
                                const result = applyJsonLogic(JSON.parse(chatGptResponse), JSON.parse(sampleData));
                                alert(result);
                            }, GridIconButton.Apply, false, true)
                        }
                        { !onFormulaChange &&
                            buttonCreator({ gridOptions }, "copy-icon", "Copy DataField", async () => {
                                await pasteToClipboard(`json:${chatGptResponse}`);
                            }, GridIconButton.Copy, false, true)
                        }

                    </div>
                </div>
            </div>
        </div >
    );
};
