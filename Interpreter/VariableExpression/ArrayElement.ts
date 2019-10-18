import {MinorRuntimeError} from '../Error';
import {isSimpleType, IType} from '../Type';
import * as Type from '../Type';
import {IGettable, ISettable} from '../Variable';
import {MyArray} from '../Variable/MyArray';

export class ArrayElement implements IGettable, ISettable {
    constructor(private array: MyArray, public type: IType, private firstIndex: number, private secondIndex?: number) {
        if (!array.isIndexInside(firstIndex, secondIndex)) {
            throw new MinorRuntimeError('Tömb elem', 'Az index(ek) a tömbön kívülre mutatnak!');
        }
    }

    public consoleName(): string {
        return this.array.name + '[' + this.firstIndex + (this.secondIndex ? ', ' + this.secondIndex : '') + ']';
    }

    public getConsoleOutput(): string {
        if (!isSimpleType(this.type)) {
            throw new MinorRuntimeError('Tömb elem', 'Nem lehetséges komplex típust kiíratni az értékét a konzolra!');
        }
        return (this.type as Type.SimpleType).formatConsoleOutput(this.array.getValueByIndex(this.firstIndex, this.secondIndex));
    }

    public getValue(): any {
        return this.array.getValueByIndex(this.firstIndex, this.secondIndex);
    }

    public setValue(value: any): void {
        this.array.setValueByIndex(value, this.firstIndex, this.secondIndex);
    }
}
