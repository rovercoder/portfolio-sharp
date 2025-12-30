import type { TZDate } from "@date-fns/tz";
import { type SiteData } from "@portfoliosharp/shared/data/v1_0_0";
import { SiteDataSchema } from "@portfoliosharp/shared/data/v1_0_0/validation";
import { type ISiteDataReader, type ISiteDataReaderConstructorArguments } from './site.data.reader.types.js';

export class SiteDataReaderV1_0_0 implements ISiteDataReader {
    siteData: SiteData;
    lastProcessedObject?: ({ runDate: Date, data: { fromDate: TZDate | Date, toDate: TZDate | Date } & object }) | undefined;

    constructor(args: ISiteDataReaderConstructorArguments<SiteData>) {
        if (args == null || typeof args !== 'object' || args.siteData == null || typeof args.siteData !== 'object') {
            throw Error('Invalid arguments for SiteDataReader constructor!');
        }
        this.siteData = args.siteData;
        this.lastProcessedObject = this._runCalculations({ fromDate: args.fromDate, toDate: args.toDate });
    }

    _runCalculations(args: { fromDate?: TZDate | Date | undefined, toDate?: TZDate | Date | undefined }): ({ runDate: Date, data: { fromDate: TZDate | Date, toDate: TZDate | Date } & object }) | undefined {
        // Run in web worker when in browser
        // Check type at runtime using Zod
        if (this.siteData == null || typeof this.siteData !== 'object' || this.siteData.version == null || typeof this.siteData.version !== 'string') {
            return;
        }
        const version = this.siteData.version.trim().split('.').map(versionPart => { 
            const versionPartTrimmed = versionPart.trim(); 
            const versionPartParsed = parseInt(versionPartTrimmed);
            return isNaN(versionPartParsed) ? versionPartTrimmed : versionPartParsed.toString()
        }).join('.');

        if (version < '1.0.0' || version >= '2.0.0') {
            return;
        }

        const result = SiteDataSchema.safeParse(this.siteData);
        if (!result.success) {
            console.error('Failed to parse site data!');
            return;
        }

        // first check schedules of each project, by the specified startDates and specified endDates, then remove breaks
        for (const project of this.siteData.content.experience.projects) {
            // TODO
        }

        throw Error('Not implemented');
        
        return;
    }

    retreatCalculations(args: { fromDate?: TZDate | Date | undefined }): void {

    }
    
    advanceCalculations(args: { toDate?: TZDate | Date | undefined }): void {

    }
}
