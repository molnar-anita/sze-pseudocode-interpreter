import {MinorRuntimeError} from '../Error';
import {isSimpleType, IType, SimpleType} from '../Type';
import {IGettable} from './IGettable';

export class Value<T> implements IGettable {
    public type: IType;
    private value: T;

    constructor(type: IType, value: T) {
        this.type = type;
        this.value = value;
    }

    public getValue(): T {
        return this.value;
    }

    public getConsoleOutput(): string {
        if (!isSimpleType(this.type)) {
            throw new MinorRuntimeError('Érték', 'Nem lehetséges kiíratni az értékét a konzolra!');
        }
        return (this.type as SimpleType).formatConsoleOutput(this.value);
    }
}
