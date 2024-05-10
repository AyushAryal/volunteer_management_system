export interface IDeserializer<T> { (json: any): T; };

export function GenericDeserializer<T>(): IDeserializer<T> {
    return (json: any): T => json as T;
}
