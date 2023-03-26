import { CONFIG } from "../../shared/lambda-genie/config-bindings";
import { loadConfigApi } from "../../shared/lambda-genie/config-utils";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<Record<string,string> | { message: string }>
) => {
    if (req.method === "GET") {
        const lambdaName = CONFIG.LAMBDA_CONFIGS.GET_SCHOOL_DETAILS.NAME;
        const environment = CONFIG.ENVIRONMENTS.DEV;
        const configApi = await loadConfigApi(lambdaName);
        const config = await configApi.getAllConfigValues(environment);
        res.status(200).json(config);
    } else {
        res.status(400).json({ message: "Only GET requests are accepted" });
    }
}
export default handler;