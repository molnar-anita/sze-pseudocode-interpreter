import {IVariableInputFormat} from '../Variable';
import {IRecordTypeInputFormat} from './IRecordTypeInputFormat';
import {IType} from './IType';
import {RecordType} from './RecordType';
import {TypeRegister} from './TypeRegister';

export class RecordTypeRegister {
    private readonly recordTypes: Map<string, RecordType>;
    public constructor(private typeRegister: TypeRegister, recordTypesInput: IRecordTypeInputFormat[]) {
        this.recordTypes = new Map<string, RecordType>();
        for (const input of recordTypesInput) {
            const fields = new Map<string, IVariableInputFormat>();
            for (const field of input.fields) {
                fields.set(field.name.toLowerCase(), field);
            }
            this.recordTypes.set(input.name, new RecordType(input.name, fields));
        }
    }

    public getAllAsArray(): IType[] {
        const arr: IType[] = new Array<IType>();
        this.recordTypes.forEach((value) => arr.push(value));
        return arr;
    }
}
