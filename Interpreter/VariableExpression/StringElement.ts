import {MinorRuntimeError} from '../Error';
import {isSimpleType, IType, TypeRegister} from '../Type';
import * as Type from '../Type';
import {IGettable, ISettable, Variable} from '../Variable';
import {MyArray} from '../Variable/MyArray';

export class StringElement implements IGettable, ISettable {
    public type: IType;

    constructor(private variable: IGettable & ISettable, private index: number, private typeRegister: TypeRegister) {
        this.type = typeRegister.getByName(Type.Character.typeName);
        const length = variable.getValue().length;
        this.isIndexInside(index);
    }

    public consoleName(): string {
        this.isIndexInside(this.index);
        return this.variable.consoleName + '[' + (this.index + 1) + ']';
    }

    public getConsoleOutput(): string {
        this.isIndexInside(this.index);
        return (this.type as Type.SimpleType).formatConsoleOutput(this.variable.getValue()[this.index]);
    }

    public getValue(): any {
        this.isIndexInside(this.index);
        return this.variable.getValue()[this.index];
    }

    public setValue(value: any): void {
        this.isIndexInside(this.index);
        const str: string = this.variable.getValue();
        this.variable.setValue(str.substring(0, this.index) + value + str.substring(this.index + 1));
    }

    private isIndexInside(index: number): boolean {
        if ( index < 0 || index >= this.variable.getValue().length ) {
            throw new MinorRuntimeError('Szöveg elem', 'Az index a szövegen kívülre mutat!');
        }
        return true;
    }


}
