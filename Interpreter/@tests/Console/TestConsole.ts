import {IConsole} from '../../Console/IConsole';

export class TestConsole implements IConsole {
    public haspPreviouslyWroteMessage: boolean = false;
    private nextReadResult: string;
    private previouslyWritedMessage: string;
    private wroteMessages: string[] = [];

    public setupNextRead(str: string): void {
        this.nextReadResult = str;
    }

    public getLastWroteMessage(): string {
        this.haspPreviouslyWroteMessage = false;
        this.wroteMessages = [];
        return this.previouslyWritedMessage;
    }

    public getWroteMessages(): string[] {
        const tmp = this.wroteMessages;
        this.wroteMessages = [];
        return tmp;
    }

    public async read(): Promise<string> {
        const next = this.nextReadResult;
        this.nextReadResult = undefined;
        return next;
    }

    public start(): void {
        this.clean();
        return;
    }

    public write(message: string): void {
        this.haspPreviouslyWroteMessage = true;
        this.previouslyWritedMessage = message;
        this.wroteMessages.push(message);
    }

    public writeError(message: string): void {
        return;
    }

    public clean(): void {
        this.haspPreviouslyWroteMessage = false;
        this.previouslyWritedMessage = null;
        this.nextReadResult = null;
        this.wroteMessages = [];
    }
}
