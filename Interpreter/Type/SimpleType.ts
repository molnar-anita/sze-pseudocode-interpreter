import {IType} from './IType';

export abstract class SimpleType implements IType {
    public static typeName: string;
    public name: string;
    public defaultValue: any;
    private constructor() { }
    public abstract checkToken(token: string): boolean;
    public abstract checkConsoleInput(str: string): boolean;
    public abstract getValueFromToken(token: string): any;
    public abstract getValueFromConsoleInput(str: string): any;
    public abstract formatConsoleOutput(value: any): string;
}

export function isSimpleType(it: any): it is SimpleType {
    return ( it as SimpleType ).formatConsoleOutput !== undefined;
}
