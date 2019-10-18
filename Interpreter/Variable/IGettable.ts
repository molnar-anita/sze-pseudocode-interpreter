import {ITypeable} from './ITypeable';

export interface IGettable extends ITypeable {
    getValue(): any;
    getConsoleOutput(): string;
}

export function isGettable(it: any): it is IGettable {
    return ( it as IGettable ).getValue !== undefined;
}
