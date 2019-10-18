import * as Bridge from '../Bridge';
import {IConsole} from './IConsole';

export class Console implements IConsole {
    public read(): Promise<any> {
        return Bridge.readFromConsole();
    }

    public start(): void {
        Bridge.startConsole();
    }

    public write(message: string): void {
        Bridge.writeToConsole(message);
    }

    public writeError(message: string): void {
        Bridge.writeErrorToConsole(message);
    }

}
