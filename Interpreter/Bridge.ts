import {CP852} from './CodePageTable/CP852';
import {InterpreterError, RuntimeError} from './Error';
import {Interpreter} from './Interpreter';
import {IRecordTypeInputFormat} from './Type';
import {IVariableInputFormat} from './Variable';

/** A fájl olyan függvényeket tartalmaz amelyek szükségesek a felülettel való kommunikációra **/
export function createInterpreter(programCode: string, recordTypes: object, variables: object) {
    return new Interpreter(programCode, recordTypes as IRecordTypeInputFormat[], variables as IVariableInputFormat[]);
}

let startConsoleJs: () => void;
let readFromConsoleJs: () => Promise<string>;
let writeToConsoleJs: (str: any) => void;
let writeErrorToConsoleJs: (str: any) => void;

export function setupConsoleFunctions(
    startFunction: () => void,
    readFunction: () => Promise<string>,
    writeFunction: (str: any) => void,
    writeErrorFunction: (str: any) => void) {

    startConsoleJs = startFunction;
    readFromConsoleJs = readFunction;
    writeToConsoleJs = writeFunction;
    writeErrorToConsoleJs = writeErrorFunction;
}

export function readFromConsole(): Promise<string> {
    return readFromConsoleJs();
}

export function writeToConsole(message: string) {
    writeToConsoleJs(message);
}

export function writeErrorToConsole(message: string) {
    writeErrorToConsoleJs(message);
}

export function startConsole() {
    startConsoleJs();
}

export function isCP852Valid(text: string): boolean {
    return CP852.validateString(text);
}

let reportRuntimeErrorJs: () => void;
let reportInterpretingErrorJs: () => void;
let reportUnknownErrorJs: () => void;

export function setupReportFunctions(
    reportRuntimeError: () => void,
    reportInterpretingError: () => void,
    reportUnknownError: () => void) {

    reportRuntimeErrorJs = reportRuntimeError;
    reportInterpretingErrorJs = reportInterpretingError;
    reportUnknownErrorJs = reportUnknownError;
}

export function reportRuntimeError(error: RuntimeError) {
    reportRuntimeErrorJs();
}

export function reportInterpretingError(error: InterpreterError) {
    reportInterpretingErrorJs();
}

export function reportUnknownError(error: Error) {
    reportUnknownErrorJs();
}
