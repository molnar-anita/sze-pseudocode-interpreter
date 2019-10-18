import {IMinorExpressionBuilder} from '../Builder';
import {MinorInterpreterError} from '../Error';
import {ExpressionBuilder} from '../Expression';
import {TypeRegister} from '../Type';
import {isGettable} from '../Variable';
import {isMyArray} from '../Variable/MyArray';
import {FieldOperator} from './Operations/FieldOperator';
import {IndexOperator} from './Operations/IndexOperator';
import {VariableExpression} from './VariableExpression';

export class VariableExpressionOperatorBuilder implements IMinorExpressionBuilder {
    public name: string;
    private expressionBuilder: ExpressionBuilder;

    public constructor(private typeRegister: TypeRegister) {}

    public linkExpressionBuilder(expressionBuilder: ExpressionBuilder) {
        this.expressionBuilder = expressionBuilder;
    }

    public process(arr: any[]): void {
        for (const finding of this.findAllArrayIndex(arr).reverse()) {
            if (finding.endIndex - finding.startIndex <= 1) {
                throw new MinorInterpreterError(this.name, 'A tömb elemét jelölő szögletes zárójelek között szerepelnie kell legalább egy indexnek!');
            }
            arr.splice(finding.startIndex, finding.endIndex - finding.startIndex + 1,
                new IndexOperator(arr.slice(finding.startIndex, finding.endIndex + 1), this.expressionBuilder, this.typeRegister));
        }
        for (let i: number = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'string' && arr[i] === '.') {
                if (i + 1 < arr.length && typeof arr[i + 1] === 'string') {
                    arr.splice(i, 2, new FieldOperator(arr[i + 1]));
                } else {
                    throw new MinorInterpreterError(this.name, `A '.' operátor rosszul van használva, utána a mező nevének kell következnie!`);
                }
            }
        }
    }

    private findAllArrayIndex(arr: any[]): Array<{startIndex: number, endIndex: number}> {
        const result = [];
        for (let i: number = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'string' && arr[i] === '[') {
                let deepnessIndex = 1;
                for (let j: number = i + 1; j < arr.length; j++) {
                    if (typeof arr[j] === 'string') {
                        if (arr[j] === '[') {
                            deepnessIndex++;
                        } else if (arr[j] === ']') {
                            deepnessIndex--;
                        }
                        if (deepnessIndex === 0) {
                            result.push({startIndex: i, endIndex: j});
                            i = j;
                            break;
                        }
                    }
                }
                if (deepnessIndex !== 0) {
                    throw new MinorInterpreterError(this.name, 'A tömb index nem lett lezárva. Hiányzó \']\'!');
                }
            }
        }
        return result;
    }
}
