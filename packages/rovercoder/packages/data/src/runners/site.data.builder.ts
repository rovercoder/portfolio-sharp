import { existsSync, readFileSync, writeFileSync } from "fs";
import { getSiteData } from "../data/site.data.js";
import type { SiteData } from "@portfoliosharp/shared";
import { siteDataOptions } from "../data/options/site.data.options.js";

const outputJsonFilePath: string = './assets/data/site.data.json';

try {

    const data: SiteData = JSON.parse(JSON.stringify(await getSiteData(siteDataOptions)))

    delete data.lastUpdated;

    const newFileString = JSON.stringify(data, null, 4);

    let continueWrite = false;

    if (existsSync(outputJsonFilePath)) {
        try {
            let oldFileString = readFileSync(outputJsonFilePath, { encoding: 'utf8' });
            if (oldFileString !== undefined && oldFileString !== null) {
                const oldFileJson: SiteData = JSON.parse(oldFileString);
                delete oldFileJson.lastUpdated;
                oldFileString = JSON.stringify(oldFileJson, null, 4);
                continueWrite = newFileString.trim() !== oldFileString.trim();
            }
        } catch (err) {
            console.error('Encountered an error whilst reading: '+outputJsonFilePath, err);
        }
    } else {
        continueWrite = true;
    }

    data.lastUpdated = (new Date()).toISOString();

    if (continueWrite) {
        try {
            writeFileSync(outputJsonFilePath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Data written to ${outputJsonFilePath} as JSON.`);
        } catch (err) {
            console.error('Encountered an error whilst writing: '+outputJsonFilePath, err);
        }
    }

} catch (err) {
    console.error('Error occured! Maybe JSON is invalid!', err);
}
