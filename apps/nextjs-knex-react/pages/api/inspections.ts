import {  Inspection } from "../../shared/types";
import type { NextApiRequest, NextApiResponse } from "next";
import knex from "../../knex"
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{inspections:Inspection[]}|{message:string}>
) => {
    if(req.method === "GET") {
        const business_id = req.query.business_id as string;
        if(!business_id) return res.status(400).json({message: "business_id is required"});
        const inspectionsRaw = await knex("inspections").select("*").where({business_id});
        const inspections = await Promise.all(inspectionsRaw.map(async (inspection) => {
            const violationCount = inspection.date ? await knex("violations").count("* as count").where({business_id, date:inspection.date}):0;
            return {
                ...inspection,
                uniqueId: inspection.business_id +":" + inspection.date + ":" + inspection.type,
                violationCount : violationCount ? violationCount[0].count : 0  
            }
        }));
        console.log(inspections);
        res.status(200).json({
            inspections 
        });
    } else {
        res.status(405).json({message: "Method not allowed"});
    }
}
export default handler;