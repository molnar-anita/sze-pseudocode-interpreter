import {IConsole} from '../../Console';
import {MinorRuntimeError, RuntimeError} from '../../Error';
import {ExpressionBuilder} from '../../Expression';
import {IRow} from '../../Lexer';
import {isGettable} from '../../Variable';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {Order} from '../Order';

export class OutOrder extends Order {
    protected static orderCommand: string = 'ki';

    protected static staticConstructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][], console: IConsole): Order {
        return new OutOrder(controlFlowBuilder, expressionBuilder, rows, console, 'Ki');
    }

    public async execute(): Promise<any> {
        try {
            let message: string = '';
            let previousNotEmpty = false;
            for (const expression of this.expressions) {
                const result = (await expression.execute());
                if (!isGettable(result)) {
                    throw new MinorRuntimeError(this.name, 'A kifejezésnek kiértékelésének kiírható típusnak kell lennie!');
                }
                const output = result.getConsoleOutput();

                if (output !== '') {
                    message += (previousNotEmpty ? ' ' : '') + output;
                }

                previousNotEmpty = (output !== '');
            }
            this.console.write(message);
        } catch (error) {
            throw RuntimeError.createFromMinorError(error, this.rowNumber);
        }
    }
}
