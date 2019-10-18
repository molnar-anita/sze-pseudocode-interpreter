import {ITypeable} from './ITypeable';

export interface ISettable extends ITypeable {
    consoleName(): string;
    setValue(value: any): void;
}

export function isSettable(it: any): it is ISettable {
    return ( it as ISettable ).setValue !== undefined;
}
