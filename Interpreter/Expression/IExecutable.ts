export interface IExecutable {
    execute(): Promise<any>;
}

export function isExecutable(it: any): it is IExecutable {
    return ( it as IExecutable ).execute !== undefined;
}
