import {IConsole} from '../Console';
import {ExpressionBuilder} from '../Expression';
import {IRow} from '../Lexer';
import {ControlFlowBuilder} from './ControlFlowBuilder';
import {IRules} from './IRules';

export abstract class ControlFlowStructure {
    public static getRules(): IRules {
        throw new Error('Not implemented');
    }

    public name: string;

    protected constructor(protected controlFlowBuilder: ControlFlowBuilder, protected expressionBuilder: ExpressionBuilder, protected rows: IRow[][], protected console?: IConsole) {}
    public abstract execute(): Promise<any>;
}
