import {InterpreterError, MinorInterpreterError, RuntimeError} from '../../Error';
import {Expression, ExpressionBuilder} from '../../Expression';
import {IRow, Lexer} from '../../Lexer';
import {Integer, Real} from '../../Type';
import {isGettable, isSettable} from '../../Variable';
import {ControlFlowBuilder} from '../ControlFlowBuilder';
import {ControlFlowStructure} from '../ControlFlowStructure';
import {IRules} from '../IRules';
import {Part} from './Part';

export class For extends ControlFlowStructure {
    public static rules: string[][] = [
        ['for', '*'],
        ['**'],
    ];

    public static getRules(): IRules {
        return {
            controlFlowName: 'For',
            create: (controlFlowBuilder, expressionBuilder, rows): ControlFlowStructure => {
                return new For(controlFlowBuilder, expressionBuilder, rows);
            },
            rules: For.rules,
        };
    }

    public readonly name: string = 'For ciklus';
    private readonly part: Part;
    private readonly firstRow: number;
    private readonly expressionForVariable: Expression;
    private readonly expressionForEndValue: Expression;
    private readonly expressionForStepValue?: Expression;

    constructor(controlFlowBuilder: ControlFlowBuilder, expressionBuilder: ExpressionBuilder, rows: IRow[][]) {
        super(controlFlowBuilder, expressionBuilder, rows);
        const row: IRow = rows[0][0];
        this.firstRow = row.rowNumber;
        const [first, ...code] = row.codeArray;
        const separatedRow = Lexer.splitByCommas(code);
        if (separatedRow.length < 2 || separatedRow.length > 3) {
            throw new InterpreterError(this.name, this.firstRow, 'Túl sok, vagy túl kevés "," lett használva!');
        }
        try {
            this.expressionForVariable = expressionBuilder.build(separatedRow[0]);
            this.expressionForEndValue = expressionBuilder.build(separatedRow[1]);
            if (separatedRow.length === 3) {
                this.expressionForStepValue = expressionBuilder.build(separatedRow[2]);
            }
        } catch (e) {
            if (e instanceof MinorInterpreterError) {
                throw InterpreterError.createFromMinorError(e, row.rowNumber);
            }
            throw e;
        }
        this.part = new Part(controlFlowBuilder, expressionBuilder, [rows[1]]);
    }

    public async execute(): Promise<any> {
        let variable;
        try {
            variable = await this.expressionForVariable.execute();
        } catch (e) {
            throw RuntimeError.createFromMinorError(e, this.firstRow);
        }

        if (!isSettable(variable) || !isGettable(variable)) {
            throw new RuntimeError(this.name, this.firstRow, 'Az első kiefejezésnek változónak kell lennie!');
        }
        if (variable.type.name !== Integer.typeName && variable.type.name !== Real.typeName) {
            throw new RuntimeError(this.name, this.firstRow, 'A első kifejezésben szereplő kifejezésnek számnak kell lennie!');
        }

        let endValue;
        try {
            endValue = await this.expressionForEndValue.execute();
        } catch (e) {
            throw RuntimeError.createFromMinorError(e, this.firstRow);
        }
        if (!isGettable(endValue) || endValue.type.name !== Integer.typeName && endValue.type.name !== Real.typeName) {
            throw new RuntimeError(this.name, this.firstRow, 'A végértéknek számnak kell lennie!');
        }
        endValue = endValue.getValue();

        let step;
        if (this.expressionForStepValue) {
            try {
                step = await this.expressionForStepValue.execute();
            } catch (e) {
                throw RuntimeError.createFromMinorError(e, this.firstRow);
            }
            if (!isGettable(step) || step.type.name !== Integer.typeName && step.type.name !== Real.typeName) {
                throw new RuntimeError(this.name, this.firstRow, 'A lépésköznek számnak kell lennie!');
            }

            if (step.type.name !== variable.type.name) {
                throw new RuntimeError(this.name, this.firstRow, 'A lépésköz és a változónak a típusának meg kell egyeznie!');
            }

            // Nagyobb a kezdőérték mint célérték
            if ((endValue - variable.getValue()) * step.getValue() < 0) {
                return;
            }
            step = step.getValue();
        } else {
            step = (endValue >= variable.getValue()) ? 1 : - 1;
        }

        if (variable.getValue() !== endValue) {
            do {
                await this.part.execute();
                variable.setValue(variable.getValue() + step);
            } while ((step > 0) ? (variable.getValue() <= endValue) : (variable.getValue() >= endValue));
        } else {
            await this.part.execute();
            variable.setValue(variable.getValue() + step);
        }
    }

}
