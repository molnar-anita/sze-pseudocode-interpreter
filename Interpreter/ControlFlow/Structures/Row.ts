import {InterpreterError, MinorInterpreterError, RuntimeError} from '../../Error';
import {ExpressionBuilder} from '../../Expression';
import * as Expression from '../../Expression/index';
import {IRow} from '../../Lexer';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {ControlFlowStructure} from '../ControlFlowStructure';

export class Row extends ControlFlowStructure {
    public readonly name: string = 'Sor';
    private readonly rowNumber: number;
    private readonly expression: Expression.Expression;
    private readonly isEmpty: boolean;

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        if (rows.length !== 1 && rows[0].length !== 1) {
            if (rows.length < 1) {
                throw new MinorInterpreterError(this.name, 'Nem kaptunk egy sor adatot sem.');
            } else {
                throw new InterpreterError(this.name, rows[0][0].rowNumber, 'Csak egy sor adatból állhat.');
            }
        }
        try {
            this.isEmpty = rows[0][0].codeArray.length === 0;
            if (!this.isEmpty) {
                this.expression = this.expressionBuilder.build(rows[0][0].codeArray);
            }
        } catch (e) {
            if (e instanceof MinorInterpreterError) {
                throw InterpreterError.createFromMinorError(e, rows[0][0].rowNumber);
            }
            throw e;
        }
        this.rowNumber = rows[0][0].rowNumber;
    }

    public async execute(): Promise<any> {
        try {
            if (this.isEmpty) {
                return;
            }
            await this.expression.execute();
        } catch (e) {
            throw RuntimeError.createFromMinorError(e, this.rowNumber);
        }
    }

}
