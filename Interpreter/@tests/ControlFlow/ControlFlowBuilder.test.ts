import * as chai from 'chai';
import {ControlFlowBuilder} from '../../ControlFlow/ControlFlowBuilder';
import {ControlFlowStructure} from '../../ControlFlow/ControlFlowStructure';
import {IRules} from '../../ControlFlow/IRules';
import {Row} from '../../ControlFlow/Structures/Row';
import {InterpreterError} from '../../Error';
import {IRow} from '../../Lexer';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const createIRows = Utils.createIRows;

class DummyControlFlow extends ControlFlowStructure {
    public static count: number = 0;
    constructor(name: string, fn: (rows: IRow[][], index?: number) => void, rows: IRow[][]) {
        super(undefined, undefined, [[]]);
        this.name = name;
        fn(rows, DummyControlFlow.count++);
    }
    public execute(): Promise<any> {
        return undefined;
    }
}

const createRule = (name: string, rule: string[][], fn: (rows: IRow[][], index?: number) => void): IRules => {
    DummyControlFlow.count = 0;
    return {
        controlFlowName: name,
        create: (controlFlowBuilder, expressionBuilder, rows): ControlFlowStructure => {
            return new DummyControlFlow(name, fn, rows);
        },
        rules: rule,
    };
};

const createFlowBuilder = (rules: IRules[]) => {
    return new ControlFlowBuilder(rules, InstanceRegister.getExpressionBuilder(), InstanceRegister.getTestConsole());
};

describe('ControlFlowBuilder', () => {
    describe('+build', () => {
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#1', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['for', '*'],
                    ['**'],
                ], (rows) => Utils.checkMultiRowNumbers([[2], [3, 4]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['15', '-', '10']],
                [5, ['for', '1', '<-']],
                [10, ['15', '/', '3']],
                [10, ['1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [Row, DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#2', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['for', '*'],
                    ['**'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['for', '1', '<-']],
                [10, ['1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#3', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['for', '*'],
                    ['**'],
                ], (rows, index) => {
                    if (index === 0) {
                        Utils.checkMultiRowNumbers([[1], [2]], rows);
                    } else if (index === 1) {
                        Utils.checkMultiRowNumbers([[4], [5]], rows);
                    }
                })],
            );
            const rows: IRow[] = createIRows ([
                [5, ['for', '1', '<-']],
                [10, ['1', '+', '3']],
                [0, ['15', '-', '1']],
                [5, ['for', '1', '<-']],
                [8, ['1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);
            Utils.checkTypesInArray(controlFlows, [DummyControlFlow, Row, DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#4', () => {
            const controlFlowBuilder = createFlowBuilder(
                [
                    createRule('Teszt', [
                        ['for1', '*'],
                        ['**'],
                    ], (rows) => Utils.checkMultiRowNumbers([[1], [2]], rows)),
                    createRule('Teszt', [
                        ['for2', '*'],
                        ['**'],
                    ], (rows) => Utils.checkMultiRowNumbers([[4], [5, 6, 7]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['for1', '1', '<-']],
                [10, ['1', '+', '3']],
                [5, ['1', '/', '1']],
                [5, ['for2', '1', '<-']],
                [10, ['1', '+', '3']],
                [15, ['1', '+', '3']],
                [10, ['1', '+', '3']],
                [5,  ['1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow, Row, DummyControlFlow, Row]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#5', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['for', '*'],
                    ['**'],
                ], (rows) => rows = rows )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['15', '-', '10']],
                [5, ['for', '1', '<-']],
                [5, ['15', '/', '3']],
                [10, ['1', '+', '3']],
            ]);
            expect( () => controlFlowBuilder.build(rows) ).to.throw(InterpreterError);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (for)#6', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['for', '*'],
                    ['**'],
                ], (rows) => rows = rows )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['for', '1', '<-']],
            ]);
            expect( () => controlFlowBuilder.build(rows) ).to.throw(InterpreterError);
        });

        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (repeat-until)#7', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['repeat'],
                    ['**'],
                    ['until', '*'],
                ], (rows) => Utils.checkMultiRowNumbers([[2], [3], [4]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['15', '-', '10']],
                [5, ['repeat']],
                [10, ['15', '/', '3']],
                [5, ['until', '1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [Row, DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (repeat-until)#8', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['repeat'],
                    ['**'],
                    ['until', '*'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2], [3]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['repeat']],
                [10, ['15', '/', '3']],
                [5, ['until', '1', '+', '3']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (repeat-until)#9', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['repeat'],
                    ['**'],
                    ['until', '*'],
                ], (rows) => Utils.checkMultiRowNumbers([[2], [3, 4, 5, 6], [7]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['15', '-', '10']],
                [5, ['repeat']],
                [10, ['15', '/', '3']],
                [11, ['15', '/', '3']],
                [12, ['15', '/', '3']],
                [12, ['15', '/', '3']],
                [5, ['until', '1', '+', '3']],
                [5, ['15', '-', '10']],
            ]);
            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [Row, DummyControlFlow, Row]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (repeat-until)#10', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['repeat'],
                    ['**'],
                    ['until', '*'],
                ], (rows) => rows = rows )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['repeat']],
                [5, ['until', 'true']],
            ]);
            expect( () => controlFlowBuilder.build(rows) ).to.throw(InterpreterError);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (repeat-until)#11', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['repeat'],
                    ['**'],
                    ['until', '*'],
                ], (rows) => rows = rows )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['repeat']],
                [10, ['1', '+', '1']],
                [10, ['until', 'true']],
            ]);
            expect( () => controlFlowBuilder.build(rows) ).to.throw(InterpreterError);
        });

        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#12', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2, 3, 4]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [10, ['15', '/', '3']],
                [10, ['1', '+', '3']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#13', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                ], (rows) => { Utils.checkMultiRowNumbers([[1], [2, 3, 4], [5], [6]], rows); })],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [10, ['15', '/', '3']],
                [10, ['1', '+', '3']],
                [5, ['else', 'if', 'true']],
                [10, ['100', '/', '2']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#14', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2], [3], [4], [5], [6]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [5, ['else', 'if', '15', '/', '3']],
                [10, ['1', '+', '3']],
                [5, ['else', 'if', '15', '/', '3']],
                [10, ['1', '+', '3']],
                [5, ['1']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow, Row]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#15', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                    ['o'],
                    ['else'],
                    ['**'],
                    ['v'],
                ], (rows) => { Utils.checkMultiRowNumbers([[1], [2], [3], [4, 5]], rows); } )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [5, ['else']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#16', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                    ['o'],
                    ['else'],
                    ['**'],
                    ['v'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2], [3], [4, 5]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [5, ['else', 'if', '3', '/', '3']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (if)#17', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                    ['o'],
                    ['else'],
                    ['**'],
                    ['v'],
                ], (rows) => Utils.checkMultiRowNumbers([[1], [2], [3], [4, 5], [6], [7, 8], [9], [10, 11]], rows))],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [5, ['else', 'if', '15', '/', '3']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
                [5, ['else', 'if', '15', '/', '3']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
                [5, ['else']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
                [5, ['1', '+', '3']],
                [10, ['1', '+', '3']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow, Row, Row]);
        });

        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (other)#18', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                    ['o'],
                    ['else'],
                    ['**'],
                    ['v'],
                ], (rows) => { Utils.checkMultiRowNumbers([[1], [2, 3, 4], [5], [6, 7]], rows); } )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [10, ['if', 'true']],
                [15, ['1']],
                [5, ['else']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow]);
        });
        it('Jól kell felismernie a szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra (other)#19', () => {
            const controlFlowBuilder = createFlowBuilder(
                [createRule('Teszt', [
                    ['if', '*'],
                    ['**'],
                    ['i'],
                    ['else', 'if', '*'],
                    ['**'],
                    ['v'],
                    ['o'],
                    ['else'],
                    ['**'],
                    ['v'],
                ], (rows, index) => {
                    if (index === 0) {
                        Utils.checkMultiRowNumbers([[1], [2, 3, 4], [5], [6, 7]], rows);
                    } else {
                        Utils.checkMultiRowNumbers([[8], [9], [10], [11]], rows);
                    }
                } )],
            );
            const rows: IRow[] = createIRows ([
                [5, ['if', '15', '-', '10']],
                [10, ['1', '-', '1']],
                [10, ['if', 'true']],
                [15, ['1']],
                [5, ['else']],
                [10, ['1', '+', '3']],
                [10, ['1', '+', '3']],
                [5, ['if', 'true']],
                [10, ['15', '/', '3']],
                [5, ['else']],
                [10, ['"kutya"']],
                [0, ['"kutya"']],
            ]);

            const controlFlows = controlFlowBuilder.build(rows);

            Utils.checkTypesInArray(controlFlows, [DummyControlFlow, DummyControlFlow, Row]);
        });
    });
});
