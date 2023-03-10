import type { NextApiRequest, NextApiResponse } from "next";
import knex from "../../knex";
import { Violation } from "../../shared/types";
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{violations:Violation[]}|{message:string}>
) => {
    if(req.method === "GET") {
        const inspection_id = req.query.inspection_id as string;
        if(!inspection_id) return res.status(400).json({message: "inspection_id is required"});
        const [business_id, date] = inspection_id.split(":");
        const violations = await knex("violations").select("*").where({business_id, date});
        res.status(200).json({
            violations : violations.map((violation) => {
                return {
                    ...violation,
                    uniqueId: inspection_id+":" + violation.ViolationTypeID
                }
            })
        });
    } else {
        res.status(405).json({message: "Method not allowed"});
    }
}
export default handler;