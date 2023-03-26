/* eslint-disable no-unused-vars */

import { ConfigJson } from "@euxdt/node-rules-engine";
import { getNodeJsConfigApi, ConfigApi } from "@euxdt/node-rules-engine";
import { CONFIG } from "./config-bindings";
import { mockConfig } from "./mock";

const apiKey = "YOUR_KEY_HERE"; //replace with your api key
const environment = CONFIG.ENVIRONMENTS.DEV;
const headers =  {
    "x-api-key": apiKey,
    "environment": environment
};
export const loadConfigApi = async (lambdaName:string):Promise<ConfigApi> => {
    const configApi = await getNodeJsConfigApi(
        {
            lambdaName,
            cacheDurationSeconds: 60,
            loadConfig: async (lastRefreshed?:Date, existingConfig?:ConfigJson) => {
                // Once you have an API key, you can uncomment this code to load the config from the server
                // if(lastRefreshed && existingConfig){
                //     const configLastUpdated = await fetch("https://config.lambdagenie.com/lastUpdated", {
                //         method: "POST",
                //         headers
                //     }).then((res) => res.json()).then((json) => new Date(json.updatedAt));
                //     console.log("Last Refreshed", lastRefreshed, "Config Last Updated", configLastUpdated);
                //     if(lastRefreshed && configLastUpdated && lastRefreshed.getTime() >= configLastUpdated.getTime()){
                //         console.log("Config is up to date");
                //         return existingConfig;  
                //     }
                // }
                // console.log("Loading Config");
                // const file = await fetch("https://config.lambdagenie.com/config", {
                //     method: "POST",
                //     headers
                // }).then((res) => res.json());
                // const configJson = file;
                // console.log("Config Json", { configJson });
                // return configJson as unknown as ConfigJson;

                return mockConfig as unknown as ConfigJson;
            },
            log: (level, message, extra) => {
                //console.log(level, message, extra);
            }
        }
    );
    return configApi;
};



