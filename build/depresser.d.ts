export interface IDepresser {
    depress(rawImg: any): Uint8Array[];
}
export declare class RAWDepresser implements IDepresser {
    depress(rawImg: any): Uint8Array[];
}
export declare class RLEDepresser implements IDepresser {
    byteCountes: number[];
    depress(rawImg: any): Uint8Array[];
    parseByteCounts(file: any, height: number, channelLength: number): void;
    parseChannelData(rawImg: any, chanIdx: number): Uint8Array;
}
export declare class RLELayerDepresser extends RLEDepresser {
    depress(rawImg: any): Uint8Array[];
    parseByteCounts(file: any, height: number, channelLength: number): void;
}
export declare class RAWLayerDepresser extends RAWDepresser {
    depress(rawImg: any): Uint8Array[];
}
