import {SimpleType} from './SimpleType';

export class Character implements SimpleType {
    public static typeName: string = 'char';
    public name: string = Character.typeName;
    public defaultValue: any = ' ';

    public checkToken(token: string): boolean {
        return /^['].[']$/.test(token);
    }

    public checkConsoleInput(str: string): boolean {
        return str.length === 1;
    }

    public getValueFromToken(token: string): any {
        return token.charAt(1);
    }

    public getValueFromConsoleInput(str: string): any {
        return str;
    }

    public formatConsoleOutput(value: any): string {
        return value;
    }
}
