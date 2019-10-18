import {IMinorExpressionBuilder} from '../Builder';
import {SimpleType, TypeRegister} from '../Type';
import {Value} from './Value';

export class ValueBuilder implements IMinorExpressionBuilder {
    public name: string = 'Érték építő';
    private types: SimpleType[];

    constructor(private typeRegister: TypeRegister) {
        this.types = typeRegister.getAllSimpleTypeAsArray();
    }

    public process(arr: any[]): void {
        for (const i in arr) {
            if (typeof arr[i] === 'string') {
                for (const type of this.types) {
                    if (type.checkToken(arr[i])) {
                        arr[i] = new Value(type, type.getValueFromToken(arr[i]));
                        break;
                    }
                }
            }
        }
    }
}
