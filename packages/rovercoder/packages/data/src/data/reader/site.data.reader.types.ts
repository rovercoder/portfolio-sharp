import type { TZDate } from "@date-fns/tz";

export interface ISiteDataReader {
    retreatCalculations(args: { fromDate?: TZDate | Date | undefined }): void;
    
    advanceCalculations(args: { toDate?: TZDate | Date | undefined }): void;
}

export interface ISiteDataReaderConstructor<T> {
    new(args: ISiteDataReaderConstructorArguments<T>): ISiteDataReader;
}

export interface ISiteDataReaderConstructorArguments<T> {
    siteData: T; 
    fromDate?: TZDate | Date | undefined;
    toDate?: TZDate | Date | undefined;
}
