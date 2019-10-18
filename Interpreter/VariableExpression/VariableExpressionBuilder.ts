import {IMinorExpressionBuilder} from '../Builder';
import {MinorInterpreterError} from '../Error';
import {ExpressionBuilder} from '../Expression';
import {TypeRegister} from '../Type';
import {isGettable, isMyRecord} from '../Variable';
import {isMyArray} from '../Variable/MyArray';
import {IVariableExpressionOperation} from './IVariableExpressionOperation';
import {isFieldOperator} from './Operations/FieldOperator';
import {isIndexOperator} from './Operations/IndexOperator';
import {VariableExpression} from './VariableExpression';

export class VariableExpressionBuilder implements IMinorExpressionBuilder {
    public name: string = 'Változó kifejezés építő';
    private expressionBuilder: ExpressionBuilder;

    constructor(private typeRegister: TypeRegister) { }

    public linkExpressionBuilder(expressionBuilder: ExpressionBuilder) {
        this.expressionBuilder = expressionBuilder;
    }

    public process(arr: any[]): void {
        let start: number = -1;
        let end: number = -1;
        let operators: IVariableExpressionOperation[] = [];
        for (let i: number = 0; i < arr.length; i++) {
            if (isIndexOperator(arr[i])) {
                if (start === -1) {
                    if (i > 0 && (isMyArray(arr[i - 1]) || isGettable(arr[i - 1]) )) {
                        start = i - 1;
                    } else {
                        throw new MinorInterpreterError(this.name, 'Csak változónak az indexét lehet lekérdezni!');
                    }
                }
                operators.push(arr[i]);
                end = i;
            } else if (isFieldOperator(arr[i])) {
                if (start === -1) {
                    if (i > 0 && isMyRecord(arr[i - 1])) {
                        start = i - 1;
                    } else {
                        throw new MinorInterpreterError(this.name, 'Csak rekordnak lehet egy mezőjét lekérdezni!');
                    }
                }
                operators.push(arr[i]);
                end = i;
            } else {
                if (start >= 0) {
                    arr.splice(start, end - start + 1, new VariableExpression(arr[start], operators));
                    i = start - 1;
                    start = -1;
                    end = -1;
                    operators = [];
                }
            }
        }
        if (start >= 0) {
            arr.splice(start, end - start + 1, new VariableExpression(arr[start], operators));
        }
    }
}
