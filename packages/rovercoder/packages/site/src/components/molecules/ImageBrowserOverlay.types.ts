import type { ImageProps } from "./CardHeader.types";

export type ImageBrowserOverlayImageFnType = (params: { image: ImageProps, imageSize: string }) => any;
export type ImageBrowserOverlayTextFnType = (params: { image: ImageProps }) => any;
