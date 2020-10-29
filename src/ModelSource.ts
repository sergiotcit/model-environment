export type ModelType = new (...args: any) => any;

export interface ModelSource {
    [key: string]: ModelType
}