import {InterpreterError, MinorInterpreterError, RuntimeError} from '../../Error';
import {Expression, ExpressionBuilder} from '../../Expression';
import {IRow, Lexer} from '../../Lexer';
import {Boolean} from '../../Type';
import {isGettable} from '../../Variable';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {ControlFlowStructure} from '../ControlFlowStructure';
import {IRules} from '../IRules';
import {Part} from './Part';

export class IfElse extends ControlFlowStructure {
    public static rules: string[][] = [
        ['if', '*'],
        ['**'],
        ['i'],
        ['else', 'if', '*'],
        ['**'],
        ['v'],
        ['o'],
        ['else'],
        ['**'],
        ['v'],
    ];

    public static getRules(): IRules {
        return {
            controlFlowName: 'If',
            create: (controlFlowBuilder, expressionBuilder, rows): ControlFlowStructure => {
                return new IfElse(controlFlowBuilder, expressionBuilder, rows);
            },
            rules: IfElse.rules,
        };
    }

    public readonly name: string = 'If elágazás';
    private sections: Array<{rowNumber: number, conditionExpression?: Expression, part: Part}> = [];

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        for (let i = 0; i < rows.length; i += 2) {
            const conditionCodeArray = rows[i][0].codeArray;
            try {
                if (conditionCodeArray[0].toLowerCase() === 'if') {
                    if (conditionCodeArray.length <= 1) {
                        throw new InterpreterError(this.name, rows[i][0].rowNumber, 'A feltételt meg kell adni!');
                    }
                    const [first, ...rest] = conditionCodeArray;
                    this.sections.push({
                        conditionExpression: this.expressionBuilder.build(rest),
                        part: new Part(controlFlowBuilder, expressionBuilder, [rows[i + 1]]),
                        rowNumber: rows[i][0].rowNumber,
                    });
                    continue;
                } else if (conditionCodeArray[0].toLowerCase() === 'else' && conditionCodeArray.length === 1) {
                    this.sections.push({
                        part: new Part(controlFlowBuilder, expressionBuilder, [rows[i + 1]]),
                        rowNumber: rows[i][0].rowNumber,
                    });
                    continue;
                } else if (conditionCodeArray[0].toLowerCase() === 'else' && conditionCodeArray[1].toLowerCase() === 'if') {
                    if (conditionCodeArray.length <= 2) {
                        throw new InterpreterError(this.name, rows[i][0].rowNumber, 'A feltételt meg kell adni!');
                    }
                    const [first, second, ...rest] = conditionCodeArray;
                    this.sections.push({
                        conditionExpression: this.expressionBuilder.build(rest),
                        part: new Part(controlFlowBuilder, expressionBuilder, [rows[i + 1]]),
                        rowNumber: rows[i][0].rowNumber,
                    });
                    continue;
                }
            } catch (e) {
                if (e instanceof MinorInterpreterError) {
                    throw InterpreterError.createFromMinorError(e, rows[i][0].rowNumber);
                }
                throw e;
            }
            throw new InterpreterError(this.name, rows[i][0].rowNumber, 'Értelmezhetettlen sor!');
        }
    }

    public async execute(): Promise<any> {
        for (const section of this.sections) {
            if (section.conditionExpression) {
                let condition;
                try {
                    condition = await section.conditionExpression.execute();
                } catch (e) {
                    throw RuntimeError.createFromMinorError(e, section.rowNumber);
                }
                if (condition.type.name !== Boolean.typeName || !isGettable(condition)) {
                    throw new RuntimeError(this.name, section.rowNumber, 'A feltételnek logikainak kell lennie!');
                }
                if (!condition.getValue()) {
                    continue;
                }
            }
            return await section.part.execute();
        }
    }
}
