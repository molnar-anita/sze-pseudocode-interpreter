import {ExpressionBuilder} from '../Expression';
import {IBuilder} from './IBuilder';

export interface IMinorExpressionBuilder extends IBuilder {
    linkExpressionBuilder?(expressionBuilder: ExpressionBuilder): void;
    process(arr: any[]): void;
}
