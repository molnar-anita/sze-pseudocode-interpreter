import {IMinorExpressionBuilder} from '../Builder';
import {Cast} from '../Cast/Cast';
import {MinorInterpreterError} from '../Error';
import {Expression, ExpressionBuilder} from '../Expression';
import {Lexer} from '../Lexer';
import * as Type from '../Type';
import {FunctionCaller} from './FunctionCaller';
import {FunctionList} from './FunctionList';
import {MyFunction} from './MyFunction';

export class FunctionBuilder implements IMinorExpressionBuilder {
    public name: string = 'Függvény építő';
    private functions: Map<string, MyFunction>;
    private expressionBuilder: ExpressionBuilder;

    public constructor(typeRegister: Type.TypeRegister, private caster: Cast) {
        this.functions = FunctionList.getFunctions(typeRegister);
    }

    public linkExpressionBuilder(expressionBuilder: ExpressionBuilder): void {
        this.expressionBuilder = expressionBuilder;
    }

    public process(arr: any[]): void {
        while (this.findDeepestFunctionAndBuild(arr)) { continue; }
    }

    public findDeepestFunctionAndBuild(arr: any[]): boolean {
        let functionStart = -1;
        let functionEnd = -1;
        let deepness = 0;
        for (let i = 0; i < arr.length; i++) {
            if (i < arr.length - 1 &&
                typeof arr[i]     === 'string' && this.functions.has(arr[i].toUpperCase()) &&
                typeof arr[i + 1] === 'string' && arr[i + 1] === '(') {
                functionStart = i;
                functionEnd = -1;
                deepness = 1;
                i++;
            } else if (deepness > 0 && typeof arr[i] === 'string' && arr[i] === '(') {
                deepness++;
            } else if (functionStart !== -1 && typeof arr[i] === 'string' && arr[i] === ')') {
                deepness--;
                if (deepness === 0) {
                    functionEnd = i;
                    break;
                }
            }
        }
        if (functionStart >= 0) {
            const myFunction = this.functions.get(arr[functionStart].toUpperCase());
            if (functionEnd === -1) {
                throw new MinorInterpreterError(this.name, `A(z) '${myFunction.name}' nevű függvény nincs lezárva!`);
            }
            const subExpressions = Lexer.splitByCommas(arr.slice(functionStart + 2, functionEnd));
            if (subExpressions.length !== myFunction.argumentsArray.length) {
                throw new MinorInterpreterError(this.name, `A(z) '${myFunction.name}' nevű függvénynek nem megfelelő mennyiségű argumentum lett megadva!`);
            }
            const argumentsExpressions = new Array<Expression>();
            subExpressions.forEach((x) => { argumentsExpressions.push(this.expressionBuilder.build(x)); });
            arr.splice(functionStart, functionEnd - functionStart + 1, new FunctionCaller(myFunction, argumentsExpressions, this.caster));
            return true;
        }
        return false;
    }

}
