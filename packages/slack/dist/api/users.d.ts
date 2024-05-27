import { APIModule } from './base';
import { User } from '../types';
export declare class Users extends APIModule {
    info: (user: string) => Promise<User>;
    list: () => Promise<User[]>;
    lookupByEmail: (email: string) => Promise<User>;
}
