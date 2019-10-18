import {IConsole} from '../../Console';
import {RuntimeError} from '../../Error';
import {ExpressionBuilder} from '../../Expression';
import {IRow} from '../../Lexer';
import {isSimpleType, SimpleType} from '../../Type';
import {ISettable, isSettable} from '../../Variable';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {Order} from '../Order';

export class InOrder extends Order {
    protected static orderCommand: string = 'be';
    protected static staticConstructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][], console: IConsole): Order {
        return new InOrder(controlFlowBuilder, expressionBuilder, rows, console, 'Be');
    }

    public async execute(): Promise<any> {
        try {
            for (const expression of this.expressions) {
                const result = (await expression.execute());
                if (!isSettable(result)) {
                    throw new RuntimeError(this.name, this.rowNumber, 'Paraméterei csak változók lehetnek!');
                }
                const target: ISettable = result;
                if (!isSimpleType(target.type)) {
                    throw new RuntimeError(this.name, this.rowNumber, 'Csak egyszerű típusokat lehet bekérni konzolról!');
                }
                const type: SimpleType = (target.type as SimpleType);
                this.console.write(target.consoleName() + ' (' + type.name + '):');

                let line: string = (await this.console.read());
                while (!type.checkConsoleInput(line)) {
                    this.console.write('Hibás bemenet!');
                    line = (await this.console.read());
                }

                target.setValue(type.getValueFromConsoleInput(line));
            }
        } catch (error) {
            throw RuntimeError.createFromMinorError(error, this.rowNumber);
        }
    }
}
