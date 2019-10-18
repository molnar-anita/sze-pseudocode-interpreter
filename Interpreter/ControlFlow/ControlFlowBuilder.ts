import {IBuilder} from '../Builder';
import * as Console from '../Console';
import {InterpreterError, MinorInterpreterError} from '../Error';
import * as Expression from '../Expression';
import {IRow} from '../Lexer';
import {ControlFlowStructure} from './ControlFlowStructure';
import {IRules} from './IRules';
import {Row} from './Structures';

export class ControlFlowBuilder implements IBuilder {
    public readonly name: string = 'Program struktúra építő';

    constructor(private controlFlowStructureRules: IRules[], private expressionBuilder: Expression.ExpressionBuilder, private console: Console.IConsole) { }

    public build(rows: IRow[]): ControlFlowStructure[] {
        const controlFlowArray: ControlFlowStructure[] = [];
        let actualRule: IRules;
        let actualRuleIndex: number = 0;
        let startRow: IRow;
        let buildRows: IRow[][] = [];
        for (let i = 0; i < rows.length; i++) {
            if (actualRule === undefined) {
                for (const rules of this.controlFlowStructureRules) {
                    if (this.rowFitRules(rows[i], rules.rules[0])) {
                        actualRule = rules;
                        startRow = rows[i];
                        buildRows.push([rows[i]]);
                        actualRuleIndex++;
                        break;
                    }
                }
                if (actualRule === undefined) {
                    try {
                        controlFlowArray.push(new Row(this, this.expressionBuilder, [[rows[i]]]));
                    }  catch (e) {
                        if (e instanceof  MinorInterpreterError) {
                            throw InterpreterError.createFromMinorError(e, rows[i].rowNumber);
                        }
                        throw e;
                    }
                } else {
                    let s: number = i + 1;
                    let isOptional: boolean = false;
                    let isRepeatable: boolean = false;
                    let optionalStartIndex: number = 0;
                    let optionalEndIndex: number = 0;
                    let beforeOptionalLength: number = 0;
                    let tmpS: number = 0;
                    while (actualRule.rules.length > actualRuleIndex) {
                        const firstChar = actualRule.rules[actualRuleIndex][0];
                        if (firstChar === 'o' || firstChar === 'i') { // o jelöli az opcionális rész kezdetét, i az opcionális ismétlődőt
                            isOptional = true;
                            tmpS = s;
                            optionalStartIndex = actualRuleIndex;
                            for (let j = actualRuleIndex + 1; j < actualRule.rules.length; j++) {
                                if (actualRule.rules[j][0] === 'v') {
                                    optionalEndIndex = j;
                                    break;
                                }
                            }
                            beforeOptionalLength = buildRows.length;
                            if (firstChar === 'i') {
                                isRepeatable = true;
                            }
                        } else if (firstChar === 'v') {
                            if (isRepeatable) {
                                tmpS = s;
                                beforeOptionalLength = buildRows.length;
                                actualRuleIndex = optionalStartIndex;
                            } else {
                                isOptional = false;
                            }
                        } else if (actualRule.rules[actualRuleIndex][0] === '**') {
                            let wasGood: boolean = false;
                            let j = 0;
                            const start = s;
                            for (j = s; j < rows.length; j++) {
                                if (rows[j].codeArray.length === 0) { continue; }
                                if (startRow.leftSpaces < rows[j].leftSpaces && this.rowFitRules(rows[j], actualRule.rules[actualRuleIndex])) {
                                    wasGood = true;
                                } else {
                                    break;
                                }
                            }
                            if (!wasGood) {
                                if (isOptional) {
                                    s = tmpS;
                                    actualRuleIndex = optionalEndIndex + 1;
                                    buildRows.splice(beforeOptionalLength, buildRows.length - beforeOptionalLength);
                                    continue;
                                } else {
                                    throw new InterpreterError(this.name, startRow.rowNumber, 'A(z) ' + actualRule.rules[actualRuleIndex - 1][0] + ' kezdetű sor után következnie kell legalább egy sornak.');
                                }
                            }
                            buildRows.push(rows.slice(start, j));
                            s = j; // Talán jó?
                        } else {
                            if (rows.length <= s) {
                                if (isOptional) {
                                    s = tmpS;
                                    actualRuleIndex = optionalEndIndex + 1;
                                    buildRows.splice(beforeOptionalLength, buildRows.length - beforeOptionalLength);
                                    continue;
                                } else {
                                    throw new InterpreterError(this.name, startRow.rowNumber, 'A sor nem felel meg a ' + actualRule.controlFlowName + ' -nak.');
                                }
                            }
                            if (startRow.leftSpaces !== rows[s].leftSpaces) {
                                if (isOptional) {
                                    s = tmpS;
                                    actualRuleIndex = optionalEndIndex + 1;
                                    buildRows.splice(beforeOptionalLength, buildRows.length - beforeOptionalLength);
                                    continue;
                                } else {
                                    throw new InterpreterError(this.name, rows[s].rowNumber, 'Ez a sor behúzása nem egyezik meg a kezdő sorééval.');
                                }
                            }
                            if (!this.rowFitRules(rows[s], actualRule.rules[actualRuleIndex])) {
                                if (isOptional) {
                                    s = tmpS;
                                    actualRuleIndex = optionalEndIndex + 1;
                                    buildRows.splice(beforeOptionalLength, buildRows.length - beforeOptionalLength);
                                    continue;
                                } else {
                                    throw new InterpreterError(this.name, rows[s].rowNumber, 'A sor nem felel meg a ' + actualRule.controlFlowName + ' -nak.');
                                }
                            }
                            buildRows.push([rows[s]]);
                            s++;
                        }
                        actualRuleIndex++;
                    }

                    controlFlowArray.push(actualRule.create(this, this.expressionBuilder, buildRows, this.console));
                    rows.splice(i, s - i);

                    actualRule = undefined;
                    actualRuleIndex = 0;
                    startRow = undefined;
                    buildRows = [];

                    i--;
                }
            }
        }
        return controlFlowArray;
    }

    private rowFitRules(row: IRow, rules: string[]): boolean {
        // let isOptional: boolean = false;
        if (row.codeArray.length < rules.length) {
            return false;
        }
        for (const i in rules) {
            if (rules[i] === '*' || rules[i] === '**') {
                return true;
            }
            if (row.codeArray[i].toLowerCase() !== rules[i]) {
                return false;
            }
        }
        return true;
    }
}
