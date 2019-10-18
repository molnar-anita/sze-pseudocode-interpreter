import {IBuilder, IMinorExpressionBuilder} from '../Builder';
import * as Error from '../Error';
import {isOperator, Operator} from '../Operator';
import {Expression} from './Expression';
import {IExecutableLevel} from './IExecutableLevel';

export class ExpressionBuilder implements IBuilder {

    private static getOperatorLevels(arr: any[]): IExecutableLevel[] {
        const operatorLevels: IExecutableLevel[] = [];
        for (const elem of arr) {
            if (isOperator(elem)) {
                const operator: Operator = elem;
                const level: IExecutableLevel = {
                    executionWay: operator.executionWay,
                    levelIndex: operator.levelIndex,
                };
                if (-1 === operatorLevels.findIndex((v) => v.levelIndex === level.levelIndex)) {
                    operatorLevels.push(level);
                }
            }
        }
        return operatorLevels.sort( (a, b) => a.levelIndex - b.levelIndex );
    }
    public name: string = 'Kifejezés építő';

    constructor(private minorBuilders: IMinorExpressionBuilder[]) {
        for (const builder of this.minorBuilders) {
            if (builder.linkExpressionBuilder) {
                builder.linkExpressionBuilder(this);
            }
        }
    }

    public build(arr: any[]): Expression {
        for (const builder of this.minorBuilders) {
            builder.process(arr);
        }

        // Szub-kifejezések felismerése 15+(1*2) vagyis a zárójelek
        while (this.findAndCreateOneSubExpression(arr)) { continue; }

        // Minden token-t sikerült-e feldolgoznunk?
        for (const elem of arr) {
            if (typeof elem === 'string') {
                throw new Error.MinorInterpreterError(this.name, 'Felismerhetetlen kifejezés: "' + elem + '"');
            }
        }

        return new Expression(arr, ExpressionBuilder.getOperatorLevels(arr));
    }

    /** Egy darab szub-kifejezést cserél ki **/
    private findAndCreateOneSubExpression(array: any[]): boolean {
        let openBracketIndex: number = -1;
        let closeBracketIndex: number = -1;
        for (const i in array) {
            if (array[i] === '(') {
                openBracketIndex = Number(i);
            }
            if (array[i] === ')') {
                if (openBracketIndex === -1) {
                    throw new Error.MinorInterpreterError(this.name, 'A kifejezésben a zárójelek száma hibás.');
                }
                closeBracketIndex = Number(i);
                break;
            }
        }
        if (openBracketIndex !== -1 && closeBracketIndex === -1) {
            throw new Error.MinorInterpreterError(this.name, 'A kifejezésben a zárójelek száma hibás.');
        } else if (openBracketIndex !== -1 && closeBracketIndex !== -1) {
            const subArray = array.slice(openBracketIndex + 1, closeBracketIndex);
            const expression = new Expression(subArray, ExpressionBuilder.getOperatorLevels(subArray));
            array.splice(openBracketIndex, closeBracketIndex - openBracketIndex + 1, expression);
            return true;
        }
        return false;
    }
}
