import {SimpleType} from './SimpleType';

export class String implements SimpleType {
    public static typeName: string = 'string';
    public name: string = String.typeName;
    public defaultValue: any = '';

    public checkToken(token: string): boolean {
        return /^["].*["]$/.test(token);
    }

    public checkConsoleInput(str: string): boolean {
        return true;
    }

    public getValueFromToken(token: string): any {
        return token.replace(/"/g, '');
    }

    public getValueFromConsoleInput(str: string): any {
        return str;
    }

    public formatConsoleOutput(value: any): string {
        return value;
    }
}
