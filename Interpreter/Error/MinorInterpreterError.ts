
export class MinorInterpreterError extends Error {
    public moduleName: string;
    constructor(moduleName: string, errorMessage: string) {
        super(errorMessage);
        this.moduleName = moduleName;
    }
}
