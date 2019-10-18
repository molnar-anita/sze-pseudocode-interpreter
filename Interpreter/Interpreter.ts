import {reportRuntimeError, reportUnknownError} from './Bridge';
import * as Bridge from './Bridge';
import {Cast} from './Cast/Cast';
import {Console, IConsole} from './Console';
import {ControlFlowBuilder} from './ControlFlow/ControlFlowBuilder';
import * as Structures from './ControlFlow/Structures';
import {InterpreterError, RuntimeError} from './Error';
import {ExpressionBuilder} from './Expression';
import {FunctionBuilder} from './Function';
import * as Lexer from './Lexer';
import {OperatorBuilder} from './Operator';
import {Subrutin} from './Subrutin/Subrutin';
import * as Type from './Type';
import {IRecordTypeInputFormat, RecordTypeRegister} from './Type';
import {IVariableInputFormat, ValueBuilder, VariableBuilder} from './Variable';
import {VariableExpressionBuilder, VariableExpressionOperatorBuilder} from './VariableExpression';

export class Interpreter {
    private readonly console: IConsole;
    private readonly lexer: Lexer.Lexer;
    private readonly typeRegister: Type.TypeRegister;
    private readonly recordTypeRegister: RecordTypeRegister;
    private readonly expressionBuilder: ExpressionBuilder;
    private readonly controlFlowBuilder: ControlFlowBuilder;
    private readonly caster: Cast;
    private main: Subrutin;

    /** A konstruktor meghívásával rögtön felépítésre kerülnek a struktúrák **/
    constructor(programCode: string, recordTypes: IRecordTypeInputFormat[], variables: IVariableInputFormat[]) {
        try {

            this.console = new Console();
            this.lexer = new Lexer.Lexer();
            this.typeRegister = new Type.TypeRegister([
                new Type.Boolean(),
                new Type.Integer(),
                new Type.Real(),
                new Type.Character(),
                new Type.String(),
            ]);
            this.recordTypeRegister = new RecordTypeRegister(this.typeRegister, recordTypes);
            this.typeRegister.addTypes(this.recordTypeRegister.getAllAsArray());
            this.caster = new Cast(this.typeRegister);

            this.expressionBuilder = new ExpressionBuilder([
                new OperatorBuilder(this.typeRegister, this.caster),
                new ValueBuilder(this.typeRegister),
                new VariableExpressionOperatorBuilder(this.typeRegister),
                new VariableBuilder(this.typeRegister, variables),
                new VariableExpressionBuilder(this.typeRegister),
                new FunctionBuilder(this.typeRegister, this.caster),
            ]);

            this.controlFlowBuilder = new ControlFlowBuilder([
                Structures.InOrder.getRules(),
                Structures.OutOrder.getRules(),
                Structures.IfElse.getRules(),
                Structures.For.getRules(),
                Structures.RepeatUntil.getRules(),
                Structures.While.getRules(),
            ], this.expressionBuilder, this.console);

            const rows = this.lexer.processCode(programCode);

            this.main = new Subrutin([rows], this.controlFlowBuilder, this.expressionBuilder);
        } catch (e) {
            if (e instanceof InterpreterError) {
                this.console.start();
                this.showHelpingMessage();
                this.console.writeError('Értelmezés közben fellépő hiba!');
                this.console.writeError(e.moduleName);
                this.console.writeError(e.rowNumber + '. sor - ' + e.message);
                Bridge.reportInterpretingError(e);
            } else {
                this.console.start();
                this.showHelpingMessage();
                this.console.writeError('Ismeretlen hiba!');
                this.console.writeError(e.message);
                reportUnknownError(e);
            }
            throw e;
        }
    }

    /** Ha sikeres volt a felépítése a struktúráknak és nem történt semmi szintaktikai hiba, futtatható a program **/
    public async execute(): Promise<any> {
        this.console.start();
        try {
            await this.main.execute();
        } catch (e) {
            if (e instanceof RuntimeError) {
                this.showHelpingMessage();
                this.console.writeError('Futásidejű hiba!');
                this.console.writeError(e.moduleName);
                this.console.writeError(e.rowNumber + '. sor - ' + e.message);
                reportRuntimeError(e);
            } else {
                this.showHelpingMessage();
                this.console.writeError('Ismeretlen hiba!');
                this.console.writeError(e.message);
                reportUnknownError(e);
            }
        }
        this.console.write('---------------------- PROGRAM VÉGE ----------------------');
    }

    private showHelpingMessage() {
        this.console.writeError('Segítséget kérni vagy hibabejelentést tenni a pszeudo@molnarattila.net-re küldött e-maillel tehet.');
        this.console.writeError('');
    }
}
