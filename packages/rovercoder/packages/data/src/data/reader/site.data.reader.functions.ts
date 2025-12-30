import type { ISiteDataReader, ISiteDataReaderConstructor, ISiteDataReaderConstructorArguments } from "./site.data.reader.types.js";

export function createSiteDataReader<T>(
    ctor: ISiteDataReaderConstructor<T>,
    args: ISiteDataReaderConstructorArguments<T>
): ISiteDataReader {
    return new ctor(args);
}
