
import * as CharHelper from './CharHelper';
import {IRow} from './IRow';

import {InterpreterError, MinorInterpreterError} from '../Error';

/** Singleton - Feldolgozza a nyers kódszöveget és IRow-okat készít belőlük **/
export class Lexer {
    public static splitByCommas(tokens: string[]): string[][] {
        if (tokens.length === 0) {
            return [];
        }
        const result: string[][] = [];
        let actualArray: string[] = [];
        let deep: number = 0;
        for (const i in tokens) {
            if (tokens[i] === '(' || tokens[i] === '[') {
                deep++;
            } else if (tokens[i] === ')' || tokens[i] === ']') {
                deep--;
             }

            if (tokens[i] === ',' && deep === 0) {
                result.push(actualArray);
                actualArray = [];
            } else {
                actualArray.push(tokens[i]);
            }
        }
        if (actualArray.length > 0 || tokens[tokens.length - 1] === ',') {
            result.push(actualArray);
        }
        return result;
    }

    private static separateTokens = ['.', ':', ',', '(', ')', '[', ']', '/', '+', '-', '<-', '*', '%', '!', '&&', '||', '<', '>', '<>', '<=', '>=', '='];
    private static instance: Lexer;
    private static moduleName: string = 'Lexer osztály';

    public constructor() {
        if (!Lexer.instance) {
            Lexer.instance = this;
        }
        return Lexer.instance;
    }

    public processCode(codeString: string): IRow[] {
        // Kommentek kiszűrése és ha több soron át tart üresekkel helyettesíteni
        let openComment: number;
        while ( (openComment = codeString.indexOf('/*')) >= 0) {
            const closeComment = codeString.indexOf('*/');
            if (closeComment === -1) {
                throw new InterpreterError(Lexer.moduleName, (codeString.match(new RegExp('\n', 'g')) || []).length, 'Lezáratlan komment! (Hiányzik a "*/")');
            }
            const emptyRows = '\n'.repeat( (codeString.substring(openComment, closeComment).match(new RegExp('\n', 'g')) || []).length );
            codeString = codeString.substr(0, openComment) + emptyRows + codeString.substr(closeComment + 2);
        }

        const rows: string[] = codeString.split('\n');
        const resultRows = new Array<IRow>(rows.length);
        for (let i = 0; i < rows.length; i++) {
            const rowNumber = i + 1;
            try {
                resultRows[i] = {
                    codeArray: this.separateString(rows[i]),
                    leftSpaces: this.countLeftSpaces(rows[i]),
                    rowNumber,
                };
            } catch (er) {
                throw InterpreterError.createFromMinorError(er, rowNumber);
            }
        }
        return resultRows;
    }

    private separateString(row: string) {
        row = row.trim().replace(/  /g, ' ');

        row += ' ';

        const arr = [];
        let startIndex: number = -1;
        let isCharQutoe: boolean = false;
        let isStringQuote: boolean = false;
        let isNumber: boolean = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (startIndex >= 0) {
                // Idézőjelek
                if (isCharQutoe || isStringQuote) {
                    if ((isCharQutoe && char === '\'') || (isStringQuote && char === '"')) {
                        arr.push(row.substring(startIndex, i + 1));
                        isCharQutoe = false;
                        isStringQuote = false;
                        startIndex = -1;
                    }
                    continue;
                } else if (isNumber) {
                    if (CharHelper.isAlpha(char)) {
                        throw new MinorInterpreterError(Lexer.moduleName, 'Hiba a sor értelmezése közben! A változók és fügvények nevét nem kezdhetjük számmal! \'' + row + '\'');
                    }
                    if (char === '.' || CharHelper.isNum(char)) {
                        continue;
                    }
                } else {
                    if (CharHelper.isAlphaNum(char)) {
                        continue;
                    }
                }

                arr.push(row.substring(startIndex, i));
                startIndex = -1;
                isNumber = false;

            }
            {
                if (char === '"') {
                    startIndex = i;
                    isStringQuote = true;
                    continue;
                } else if (char === '\'') {
                    startIndex = i;
                    isCharQutoe = true;
                    continue;
                } else if (CharHelper.isNum(char)) {
                    startIndex = i;
                    isNumber = true;
                    continue;
                } else if (CharHelper.isAlpha(char)) {
                    startIndex = i;
                    continue;
                } else if (CharHelper.isWhite(char)) {
                    continue;
                } else {
                    let index: number = -1;
                    if (i < row.length + 1) {
                        index = Lexer.separateTokens.indexOf(row.substr(i, 2));
                        if (index >= 0) {
                            arr.push(Lexer.separateTokens[index]);
                            i++;
                            continue;
                        }
                    }
                    index = Lexer.separateTokens.indexOf(char);
                    if (index >= 0) {
                        arr.push(Lexer.separateTokens[index]);
                        continue;
                    }
                    throw new MinorInterpreterError(Lexer.moduleName, 'Hiba a sor értelmezése közben! Meg nem engedett karakter! \'' + char + '\'');
                }

            }

        }
        return arr;
    }

    private countLeftSpaces(codeString: string): number {
        return codeString.trim().length === 0 ? 0 : codeString.length - codeString.replace(/^\s+/, '').length;
    }
}
