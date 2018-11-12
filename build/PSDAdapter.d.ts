import * as core from "uxele-core";
import { IProject } from "uxele-core";
import "script-loader!./vendor/psd.min.js";
export declare class PSDAdapter implements core.IFileAdapter {
    private decodePages;
    acceptExtensions: string[];
    fileTypeName: string;
    decodeProject(designFile: core.IFileBlob): Promise<IProject>;
    checkFileMeta(meta: core.IFileMeta): boolean;
}
