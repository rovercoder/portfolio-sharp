import type { ImageProps } from "./CardHeaderDefault.types";

export function getImagesForCardHeaderAndImageBrowser(image: ImageProps | ImageProps[] | null | undefined) {
    return (image == null || (Array.isArray(image) && image.filter(x => x != null).length === 0)) ? null : (Array.isArray(image) ? image.filter(x => x != null) : [image]);
}
