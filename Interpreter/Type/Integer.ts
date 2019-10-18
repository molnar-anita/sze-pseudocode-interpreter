import {MinorInterpreterError} from '../Error';
import {MinorRuntimeError} from '../Error';
import {SimpleType} from './SimpleType';

export class Integer implements SimpleType {
    public static maximum: number = Math.pow(2, 31);
    public static minimum: number = -Math.pow(2, 31);

    public static typeName: string = 'int';
    public name: string = Integer.typeName;
    public defaultValue: any = 0;
    private moduleName: string = 'Egész szám típus';

    public checkToken(token: string): boolean {
        return /^[0-9]+$/.test(token);
    }

    public checkConsoleInput(str: string): boolean {
        return /^[+-]?[0-9]+$/.test(str.trim());
    }

    // Tokenként csak szám szereplhet előjel nélkül
    public getValueFromToken(token: string): any {
        const num: number = Number(token);
        if (Number.isNaN(num)) {
            throw new MinorInterpreterError(this.moduleName, '"' + token + '" nem szám');
        }
        // 32 bit-esek a számok (előjelesek)
        if (!(Number.isInteger(num) && num < Integer.maximum && num > Integer.minimum)) {
            throw new MinorInterpreterError(this.moduleName, 'A szám nem fér bele egy 32 bites egész előjeles szám értékbe "' + token + '"');
        }
        return num;
    }

    // Konzolról bejöhet előjeles szám is
    public getValueFromConsoleInput(str: string): any {
        let minus: boolean = false;
        str = str.trim();
        switch (str.charAt(0)) {
            case '-':
                minus = true;
            case '+':
                str = str.substr(1);
                break;
        }
        let num: number = 0;
        try {
            num = this.getValueFromToken(str);
        } catch (er) {
            throw new MinorRuntimeError((er as MinorInterpreterError).moduleName, (er as MinorInterpreterError).message);
        }
        if (minus) {
            return -num;
        }
        return num;
    }

    public formatConsoleOutput(value: any): string {
        return (value as number).toString();
    }
}
