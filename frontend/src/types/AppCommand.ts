export type AppCommand = {
    name: string;
    id: string;
    fn: () => void;
}