import fs from 'fs';
import fetch from 'node-fetch';
import AdmZip from "adm-zip";

const sqlite3 = require('sqlite3').verbose();
let dbLocation = process.env.DB_LOCATION || "tmp/schools.db";



export const downloadFile = async (url) => {
    const response = await fetch(url);
    const fileStream = fs.createWriteStream('/tmp/schools.db.zip');
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on("error", (err) => {
            reject(err);
        });
        fileStream.on("finish", function () {
            resolve({});
        });
    });
};
export const getDb = async () => {
    if (!fs.existsSync(dbLocation)) {
        //download from https://github.com/flexicious/react-data-grid/blob/master/dbs/schools.db
        //and place in the dbs folder
        console.log("downloading db");
        await downloadFile("https://raw.githubusercontent.com/flexicious/react-data-grid/master/dbs/schools.db.zip");
        const zip = new AdmZip("/tmp/schools.db.zip");
        zip.extractAllTo("/tmp", true);
        console.log("writing to /tmp/schools.db");
        dbLocation = "/tmp/schools.db";
    }
    return new sqlite3.Database(dbLocation);
}