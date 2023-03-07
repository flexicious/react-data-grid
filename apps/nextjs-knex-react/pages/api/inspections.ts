import {  Inspection } from "../../shared/types";
import type { NextApiRequest, NextApiResponse } from "next";
import knex from "../../knex"
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{inspections:Inspection[]}|{message:string}>
) => {
    if(req.method === "GET") {
        const inspections = await knex("inspections").select("*").offset(0).limit(100)
        res.status(200).json({
            inspections
        });
    } else {
        res.status(405).json({message: "Method not allowed"});
    }
}
export default handler;