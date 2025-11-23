export interface FlexProperties extends DisplayProperties {
    display: 'flex';
    flexDirection?: string;
    flexWrap?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    gap?: string;
}

export interface GridProperties extends DisplayProperties {
    display: 'grid';
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridTemplateAreas?: string;
    gap?: string;
}

export interface DisplayProperties {
    display: string;
}
