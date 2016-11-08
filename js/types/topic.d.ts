import Query from '../queries/query';
interface Topic {
    topic: string | symbol;
    matcher: (message: string) => boolean;
    queries: (() => Query)[];
}
export default Topic;
