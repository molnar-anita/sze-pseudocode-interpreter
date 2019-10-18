import {IMinorExpressionBuilder} from '../Builder';
import {TypeRegister} from '../Type';
import {IVariableInputFormat} from './IVariableInputFormat';
import {MyArray} from './MyArray';
import {MyRecord} from './MyRecord';
import {Variable} from './Variable';

export class VariableBuilder implements IMinorExpressionBuilder {
    public name: string = 'Változó építő';
    private variables: Array<Variable<any> | MyArray | MyRecord> = new Array<Variable<any>>();

    constructor(private typeRegister: TypeRegister, variablesArray: IVariableInputFormat[]) {
        for (const variableData of variablesArray) {
            const type = typeRegister.getByName(variableData.type);
            if (variableData.isArray || variableData.isTwoDimensionalArray) {
                this.variables.push(new MyArray(
                    variableData.name,
                    variableData.isTwoDimensionalArray ? [variableData.arrayLength, variableData.arraySecondDimensionLength] : [variableData.arrayLength],
                    typeRegister.getByName(variableData.type),
                    typeRegister));
            } else if (variableData.isRecord) {
                this.variables.push(
                    new MyRecord(variableData.name, typeRegister.getByName(variableData.type), typeRegister),
                );
            } else {
                this.variables.push(new Variable(variableData.name, type));
            }
        }
    }

    public process(arr: any[]): void {
        for (const i in arr) {
            if (typeof arr[i] === 'string') {
                for (const variable of this.variables) {
                    if (arr[i].toLowerCase() === variable.name.toLowerCase()) {
                        arr[i] = variable;
                        break;
                    }
                }
            }
        }
    }
}
