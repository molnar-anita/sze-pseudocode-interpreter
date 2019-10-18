import {SimpleType} from './SimpleType';

export class Boolean implements SimpleType {
    public static typeName: string = 'bool';
    public name: string = Boolean.typeName;
    public defaultValue: any = false;

    public checkToken(token: string): boolean {
        token = token.toLowerCase();
        return  token === 'igaz' || token === 'hamis';
    }

    public checkConsoleInput(str: string): boolean {
        str = str.toLowerCase().trim();
        return this.checkToken(str);
    }

    public getValueFromToken(token: string): any {
        return token.toLowerCase() === 'igaz';
    }

    public getValueFromConsoleInput(str: string): any {
        return this.getValueFromToken(str.trim());
    }

    public formatConsoleOutput(value: any): string {
        return value ? 'igaz' : 'hamis';
    }
}
