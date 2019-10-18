import {MinorInterpreterError, MinorRuntimeError} from '../Error';
import {isRecordType, IType, RecordType, TypeRegister} from '../Type';
import {ITypeable} from './ITypeable';
import {MyArray} from './MyArray';
import {Variable} from './Variable';

export class MyRecord implements ITypeable {
    private fields: Map<string, Variable<any> | MyArray>;
    public constructor(public name: string, public type: IType, private typeRegister: TypeRegister) {
        if (!isRecordType(type)) {
            throw new MinorInterpreterError('Rekord', 'Hibás rekord típus!');
        } else {
            this.fields = new Map<string, Variable<any>>();
        }
    }

    public setFields(fields: Map<string, Variable<any> | MyArray>) {
        this.fields = new Map<string, Variable<any>>();
        fields.forEach((variable, key) => {
            this.fields.set(key.toLowerCase(), variable.clone(this.name + '.' + key));
        });
    }

    public getFields(): Map<string, Variable<any> | MyArray> {
        return this.fields;
    }

    public getField(name: string): Variable<any> | MyArray {
        // Lazy load and init
        const recordType = (this.type as RecordType);
        if (recordType.fieldList.has(name.toLowerCase())) {
            if (!this.fields.has(name.toLowerCase())) {
                const properties = recordType.fieldList.get(name.toLowerCase());
                const variableName = this.name + '.' + properties.name;
                if (properties.isArray) {
                    const dimensions = properties.isTwoDimensionalArray ? [properties.arrayLength, properties.arraySecondDimensionLength] : [properties.arrayLength];
                    const array = new MyArray(variableName, dimensions, this.typeRegister.getByName(properties.type), this.typeRegister);
                    this.fields.set(name.toLowerCase(), array);
                } else {
                    const variable = new Variable(variableName, this.typeRegister.getByName(properties.type));
                    this.fields.set(name.toLowerCase(), variable);
                }
            }
            return this.fields.get(name.toLowerCase());
        } else {
            throw new MinorRuntimeError('Rekord', `A "${this.name}" nevű és "${recordType.name}" típusú rekordnak nincs "${name}" mezője!`);
        }
    }
}

export function isMyRecord(it: any): it is MyRecord {
    return (it as MyRecord).getField !== undefined;
}
