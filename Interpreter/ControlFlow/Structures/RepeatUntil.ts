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

export class RepeatUntil extends ControlFlowStructure {
    public static rules: string[][] = [
        ['repeat'],
        ['**'],
        ['until', '*'],
    ];

    public static getRules(): IRules {
        return {
            controlFlowName: 'Repeat until',
            create: (controlFlowBuilder, expressionBuilder, rows): ControlFlowStructure => {
                return new RepeatUntil(controlFlowBuilder, expressionBuilder, rows);
            },
            rules: RepeatUntil.rules,
        };
    }

    public readonly name: string = 'Repeat until ciklus';
    private readonly part: Part;
    private readonly conditionRowNumber: number;
    private readonly conditionExpression: Expression;

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        const [first, ...rest] = rows[2][0].codeArray;
        if (rest.length === 0) {
            throw new InterpreterError(this.name, rows[2][0].rowNumber, 'Kötelező megadni feltételt!');
        }

        try {
        this.conditionExpression = this.expressionBuilder.build(rest);
        } catch (e) {
            if (e instanceof MinorInterpreterError) {
                throw InterpreterError.createFromMinorError(e, rows[0][0].rowNumber);
            }
            throw e;
        }

        this.conditionRowNumber = rows[2][0].rowNumber;
        this.part = new Part(controlFlowBuilder, expressionBuilder, [rows[1]]);
    }

    public async execute(): Promise<any> {
        let exit = false;
        let iterations = 0;
        do {
            await this.part.execute();
            let condition;
            try {
                condition = (await this.conditionExpression.execute());
            } catch (e) {
                throw RuntimeError.createFromMinorError(e, this.conditionRowNumber);
            }
            if (condition.type.name !== Boolean.typeName || !isGettable(condition)) {
                throw new RuntimeError(this.name, this.conditionRowNumber, 'A feltételnek logikainak kell lennie!');
            }
            if (++iterations >= MAX_ITERATION) {
                throw new RuntimeError(this.name, this.conditionRowNumber, 'Végtelen ciklus!');
            }
            exit = condition.getValue();
        } while (!exit);
    }

}
