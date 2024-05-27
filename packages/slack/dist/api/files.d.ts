import { APIModule } from './base';
import { File, FileUploadOptions } from '../types';
export declare class Files extends APIModule {
    upload: (options: Partial<FileUploadOptions>) => Promise<File>;
    sharedPublicURL: (options: {
        file: string;
    }) => Promise<File>;
}
