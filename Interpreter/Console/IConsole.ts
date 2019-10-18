
export interface IConsole {
    start(): void;
    read(): Promise<string>;
    write(message: string): void;
    writeError(message: string): void;
}
