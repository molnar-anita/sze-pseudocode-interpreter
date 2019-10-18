import {MinorInterpreterError} from './MinorInterpreterError';

export class RuntimeError extends Error {
    public static createFromMinorError(err: MinorInterpreterError, rowNumber: number): RuntimeError {
        return new RuntimeError(err.moduleName, rowNumber, err.message);
    }

    constructor(public moduleName: string, public rowNumber: number, errorMessage: string) {
        super(errorMessage);
    }
}
