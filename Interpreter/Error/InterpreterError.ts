import {MinorInterpreterError} from './MinorInterpreterError';

export class InterpreterError extends Error {
    public static createFromMinorError(err: MinorInterpreterError, rowNumber: number): InterpreterError {
        return new InterpreterError(err.moduleName, rowNumber, err.message);
    }

    constructor(public moduleName: string, public rowNumber: number, errorMessage: string) {
        super(errorMessage);
    }
}
