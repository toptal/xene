import Query from '../queries/query';
interface Scenario {
    title: string;
    matcher: (message: string) => boolean;
    queries: (() => Query)[];
}
export default Scenario;
