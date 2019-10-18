import {IConsole} from '../Console';
import {ExpressionBuilder} from '../Expression';
import {IRow} from '../Lexer';
import {ControlFlowBuilder} from './ControlFlowBuilder';
import {ControlFlowStructure} from './ControlFlowStructure';

export interface IRules {
    controlFlowName: string;
    rules: string[][];
    create(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][], console?: IConsole): ControlFlowStructure;
}
