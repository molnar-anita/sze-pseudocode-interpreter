import {MAX_ITERATION} from '../../Config';
import {InterpreterError, MinorInterpreterError, RuntimeError} from '../../Error';
import {Expression, ExpressionBuilder} from '../../Expression';
import {IRow} from '../../Lexer';
import {Boolean} from '../../Type';
import {isGettable} from '../../Variable';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {ControlFlowStructure} from '../ControlFlowStructure';
import {IRules} from '../IRules';
import {Part} from './Part';

export class While extends ControlFlowStructure {
    public static rules: string[][] = [
        ['while', '*'],
        ['**'],
    ];

    public static getRules(): IRules {
        return {
            controlFlowName: 'While',
            create: (controlFlowBuilder, expressionBuilder, rows): ControlFlowStructure => {
                return new While(controlFlowBuilder, expressionBuilder, rows);
            },
            rules: While.rules,
        };
    }

    public readonly name: string = 'While ciklus';
    private readonly part: Part;
    private readonly conditionRowNumber: number;
    private readonly conditionExpression: Expression;

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        const [first, ...rest] = rows[0][0].codeArray;
        if (rest.length === 0) {
            throw new InterpreterError(this.name, rows[0][0].rowNumber, 'Kötelező megadni feltételt!');
        }
        try {
            this.conditionExpression = this.expressionBuilder.build(rest);
        } catch (e) {
            if (e instanceof MinorInterpreterError) {
                throw InterpreterError.createFromMinorError(e, rows[0][0].rowNumber);
            }
            throw e;
        }

        this.conditionRowNumber = rows[0][0].rowNumber;
        this.part = new Part(controlFlowBuilder, expressionBuilder, [rows[1]]);
    }

    public async execute(): Promise<any> {
        let exit: boolean = false;
        let iterations = 0;
        do {
            let condition;
            try {
                condition = await this.conditionExpression.execute();
            } catch (e) {
                throw RuntimeError.createFromMinorError(e, this.conditionRowNumber);
            }
            if (condition.type.name !== Boolean.typeName || !isGettable(condition)) {
                throw new RuntimeError(this.name, this.conditionRowNumber, 'A feltételnek logikainak kell lennie!');
            }
            exit = !condition.getValue();
            if (condition.getValue()) {
                await this.part.execute();
                if (++iterations >= MAX_ITERATION) {
                    throw new RuntimeError(this.name, this.conditionRowNumber, 'Végtelen ciklus!');
                }
            }
        } while (!exit);
    }

}
