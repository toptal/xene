import { APIModule } from './base';
export type Identity = {
    url: string;
    team: string;
    user: string;
    teamId: string;
    userId: string;
};
export declare class Auth extends APIModule {
    protected get token(): string;
    test: () => Promise<Identity>;
    revoke: (test?: boolean) => Promise<{
        revoked: boolean;
    }>;
}
