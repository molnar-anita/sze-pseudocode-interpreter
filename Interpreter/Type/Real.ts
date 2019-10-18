import {SimpleType} from './SimpleType';

import {MinorInterpreterError} from '../Error/MinorInterpreterError';
import {MinorRuntimeError} from '../Error/MinorRuntimeError';

export class Real implements SimpleType {
    public static typeName: string = 'real';
    public name: string = Real.typeName;
    public defaultValue: any = 0.0;
    private moduleName: string = 'Valós szám típus';

    public checkToken(token: string): boolean {
        return /^[0-9]+([.]?[0-9]+)?$/.test(token);
    }

    public checkConsoleInput(str: string): boolean {
        return /^[+-]?[0-9]+([.]?[0-9]+)?$/.test(str.trim());
    }

    // Tokenként csak szám szereplhet előjel nélkül
    public getValueFromToken(token: string): any {
        const num: number = Number(token);
        if (Number.isNaN(num)) {
            throw new MinorInterpreterError(this.moduleName, '"' + token + '" nem szám');
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
