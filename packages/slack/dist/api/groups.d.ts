import { APIModule } from './base';
import { Group } from '../types';
export declare class Groups extends APIModule {
    info: (group: string) => Promise<Group>;
    list: () => Promise<Group[]>;
}
