import {InterpreterError, RuntimeError} from '../../Error';
import {ExpressionBuilder} from '../../Expression';
import {IRow} from '../../Lexer';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {ControlFlowStructure} from '../ControlFlowStructure';

export class Part extends ControlFlowStructure {
    public readonly name: string = 'Program rész';
    private readonly controlFlowElements: ControlFlowStructure[];

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        if (rows.length !== 1) {
            throw new InterpreterError(this.name, rows[0][0].rowNumber, 'Csak egymásután következő, összefüggő sorokból állhat.');
        }
        this.controlFlowElements = this.controlFlowBuilder.build(rows[0]);
    }

    public async execute(): Promise<any> {
        for (const element of this.controlFlowElements) {
            await element.execute();
        }
    }

}
