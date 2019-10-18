import {IConsole} from '../Console';
import {InterpreterError, MinorInterpreterError} from '../Error';
import {Expression, ExpressionBuilder} from '../Expression';
import {IRow, Lexer} from '../Lexer';
import {ControlFlowBuilder} from './ControlFlowBuilder';
import {ControlFlowStructure} from './ControlFlowStructure';
import {IRules} from './IRules';

export abstract class Order extends ControlFlowStructure {
    public static getRules(): IRules {
        return {
            controlFlowName: 'Parancs',
            create: this.staticConstructor,
            rules: [[this.orderCommand, ':', '*']],
        };
    }

    protected static orderCommand: string;

    protected static staticConstructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][], console: IConsole): Order {
        throw new Error('Not implemented');
    }

    public name: string;

    protected rowNumber: number;
    protected expressions: Expression[] = [];

    protected constructor(protected controlFlowBuilder: ControlFlowBuilder, protected expressionBuilder: ExpressionBuilder, protected rows: IRow[][], protected console: IConsole, orderCommand: string) {
        super(controlFlowBuilder, expressionBuilder, rows);
        this.name = orderCommand + ' parancs';
        const row = rows[0][0];
        this.rowNumber = row.rowNumber;
        const [command, colon, ...rest] = row.codeArray;
        const splittedRow = Lexer.splitByCommas(rest);
        if (splittedRow.length === 0) {
            throw new InterpreterError(this.name, row.rowNumber, 'A parancs után legalább egy kifejezésnek szerepelnie kell');
        }
        for (const split of splittedRow) {
            try {
                this.expressions.push(this.expressionBuilder.build(split));
            } catch (e) {
                if (e instanceof MinorInterpreterError) {
                    throw InterpreterError.createFromMinorError(e, row.rowNumber);
                }
                throw e;
            }
        }
    }
    public abstract execute(): Promise<any>;
}
