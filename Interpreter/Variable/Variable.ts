import {MinorRuntimeError} from '../Error';
import * as Type from '../Type';
import {isSimpleType} from '../Type';
import {IGettable} from './IGettable';
import {ISettable} from './ISettable';

export class Variable<T> implements IGettable, ISettable {
    public type: Type.IType;
    private value: T;
    private isSetted: boolean = false;

    constructor(public name: string, type: Type.IType) {
        this.type = type;
    }

    public getValue(): T {
        if (!this.isSetted) {
            throw new MinorRuntimeError('Változó', 'A változónak nincs beállítva érték!');
        }
        return this.value;
    }

    public setValue(value: T): void {
        this.value = value;
        this.isSetted = true;
    }

    public getConsoleOutput(): string {
        if (!isSimpleType(this.type)) {
            throw new MinorRuntimeError('Változó', 'Nem lehetséges kiíratni az értékét a konzolra!');
        }
        return (this.type as Type.SimpleType).formatConsoleOutput(this.getValue());
    }

    public consoleName(): string {
        return this.name;
    }

    public clone(name?: string): Variable<T> {
        if (!name) {
            name = this.name;
        }
        const newVariable = new Variable<T>(name, this.type);
        if (this.isSetted) {
            newVariable.setValue(this.value);
        }
        return newVariable;
    }
}
