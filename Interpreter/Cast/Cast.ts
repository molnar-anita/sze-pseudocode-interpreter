import {MinorRuntimeError} from '../Error';
import {IType, TypeRegister} from '../Type';
import * as Variable from '../Variable';

export class Cast {
    private static moduleName: string = 'Kasztolás';

    constructor(private typeRegister: TypeRegister) {}

    // Típus kasztolás
    public castTwoIGettable(a: Variable.IGettable, b: Variable.IGettable) {
        if (a.type === b.type) {
            return a;
        }
        if (a.type.name === 'int'  && b.type.name === 'real' ||
            a.type.name === 'real' && b.type.name === 'int') {
            return new Variable.Value(this.typeRegister.getByName('real'), a.getValue());
        }
        if (a.type.name === 'char'   && b.type.name === 'string' ||
            a.type.name === 'string' && b.type.name === 'char') {
            return new Variable.Value(this.typeRegister.getByName('string'), a.getValue());
        }
        throw new MinorRuntimeError(Cast.moduleName , 'Kasztolás sikertelen! A(z) "' + (a.type.name) + '" típust nem sikerült kasztolni "' + (b.type.name) + '"-ra.');
    }

    public hardCastTwoIGettable(a: Variable.IGettable, b: Variable.IGettable) {
        return this.hardCastIGettableToType(a, b.type);
    }

    public hardCastIGettableToType(a: Variable.IGettable, b: IType) {
        if (a.type === b) {
            return a;
        }
        if (a.type.name === 'int' && b.name === 'real') {
            return new Variable.Value(this.typeRegister.getByName('real'), a.getValue());
        }
        if (a.type.name === 'real' && b.name === 'int') {
            return new Variable.Value(this.typeRegister.getByName('int'), Math.floor( (a.getValue() as number) ));
        }
        if (a.type.name === 'char' && b.name === 'string') {
            if (a.getValue().length !== 1) {
                throw new MinorRuntimeError(Cast.moduleName , 'Szigorú kasztolás sikertelen! Csak egy karaktert tartalmazó szöveget lehet karakterré kasztolni.');
            }
            return new Variable.Value(this.typeRegister.getByName('char'), a.getValue());
        }
        if (a.type.name === 'string' && b.name === 'char') {
            return new Variable.Value(this.typeRegister.getByName('string'), a.getValue());
        }
        throw new MinorRuntimeError(Cast.moduleName , 'Szígorú kasztolás sikertelen! A(z) "' + (a.type.name) + '" típust nem sikerült kasztolni "' + (b.name) + '"-ra.');
    }
}
