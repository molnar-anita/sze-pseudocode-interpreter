import * as chai from 'chai';
import {IRow} from '../Lexer';

const expect = chai.expect;

export function checkTypesInArray(arr: any[], types: any[]): void {
    expect(arr.length).to.equal(types.length);
    for (const i in arr) {
        if (typeof types[i] === 'string') {
            if (typeof arr[i] !== types[i]) {
                throw Error('\n\t ' + typeof arr[i] + ' !== ' + types[i] + '\n\t Array index: ' + i);
            }
        } else if (!(arr[i] instanceof types[i])) {
            throw Error('\n\t ' + arr[i].constructor.name + ' !== ' + types[i].name + '\n\t Array index: ' + i);
        }
    }
}

export function checkRowNumbers(rowNumbers: number[], rows: IRow[]) {
    expect(rowNumbers.length).to.equal(rows.length);
    for (const i in rowNumbers) {
        expect(rows[i].rowNumber).to.equal(rowNumbers[i]);
    }
}

export function checkMultiRowNumbers(rowNumbers: number[][], rows: IRow[][]) {
    expect(rowNumbers.length).to.equal(rows.length);
    for (const i in rowNumbers) {
        checkRowNumbers(rowNumbers[i], rows[i]);
    }
}

export function createIRows(arr: any[][]) {
    const array: IRow[] = new Array(arr.length);
    for (const i in arr) {
        array[i] = {
            codeArray: arr[i][1],
            leftSpaces: arr[i][0],
            rowNumber: Number(i) + 1,
        };
    }
    return array;
}
