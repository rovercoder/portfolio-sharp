export interface ImageProps { 
    url?: string | undefined; 
    color?: string | undefined; 
    imageRepeat?: string | undefined; 
    imageSize?: string | undefined; 
    description?: string | undefined;
    isMainImage?: boolean | undefined;
}

export type CardHeaderImageFnType = (params: { image: ImageProps, imageBorderRadius: string | undefined, imageHeight: string, imageSize: string }) => any;
export type CardHeaderIconFnType = (params: { icon: ImageProps, iconBorderRadius: string | undefined, iconMargin: string | undefined, iconSize: string }) => any;
