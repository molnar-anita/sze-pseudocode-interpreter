import * as chai from 'chai';

import * as Structures from '../../ControlFlow/Structures/index';
import {RuntimeError} from '../../Error';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('VariableExpression', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t10', '[', '1', ']', '<-', '5']],
                [0, ['ki', ':', 't10', '[', '1', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['5']);
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '1', ',', '5']],
                [5, ['t10', '[', 'num', ']', '<-', '10']],
                [5, ['ki', ':', 't10', '[', 'num', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['10', '10', '10', '10', '10']);
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '1', ',', '5']],
                [5, ['t5x10', '[', 'num', ',', '5', ']', '<-', 'igaz']],
                [5, ['ki', ':', 't5x10', '[', 'num', ',', '5', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['igaz', 'igaz', 'igaz', 'igaz', 'igaz']);
        });
        it('Végre kell hajtani a kifejezéseket#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '1', ',', '10', ',', '2']],
                [5, ['t5x10', '[', '1', ',', 'num', ']', '<-', 'igaz']],
                [0, ['for', 'num', '<-', '2', ',', '10', ',', '2']],
                [5, ['t5x10', '[', '1', ',', 'num', ']', '<-', 'hamis']],
                [0, ['for', 'num', '<-', '1', ',', '10', ',', '1']],
                [5, ['ki', ':', 't5x10', '[', '1', ',', 'num', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For, Structures.For, Structures.For]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['igaz', 'hamis', 'igaz', 'hamis', 'igaz', 'hamis', 'igaz', 'hamis', 'igaz', 'hamis']);
        });
        it('Végre kell hajtani a kifejezéseket#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"ABCDE"']],
                [0, ['for', 'num', '<-', '1', ',', '5']],
                [5, ['KI', ':', 'string', '[', 'num', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.For]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
        });
        it('Végre kell hajtani a kifejezéseket#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t10', '[', '0', ']', '<-', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#7', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t10', '[', '1', ',', '1', ']', '<-', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#8', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '""']],
                [0, ['ki', ':', 'string', '[', '1', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#9', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '""']],
                [0, ['ki', ':', 'string', '[', '0', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#10', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '1', ',', '11', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#11', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '6', ',', '10', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#12', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '"string"', ',', '5', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#13', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '3.5', ',', '10', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#14', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '6', ',', '10', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#15', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t5x10', '[', '2', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#16', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"12345"']],
                [0, ['ki', ':', 'string', '[', '10', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#17', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"12345"']],
                [0, ['string', '[', '3', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#18', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"ABCDE"']],
                [0, ['string', '[', '3', ']', '<-', '\'3\'']],
                [0, ['ki', ':', 'string']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['AB3DE']);
        });
        it('Végre kell hajtani a kifejezéseket#19', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"12345"']],
                [0, ['ki', ':', 'string', '[', '10', ',', '10', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#20', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"12345"']],
                [0, ['ki', ':', 'string', '[', '"egy"', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#21', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['t10', '[', 'igaz', ']', '<-', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#22', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['KI', ':', 't5x10', '[', 'igaz', ',', '1', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#23', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['KI', ':', 't5x10', '[', '1', ',', 'igaz', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#24', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['KI', ':', 't5x10', '[', '1', ',', 'unsetted', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#25', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['string', '<-', '"12345"']],
                [0, ['ki', ':', 'string', '[', 'unsetted', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#26', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'tu5', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#27', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'tu5', '[', '4', '/', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#28', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'tu5x4', '[', '2', ',', '3', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#29', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['tas6', '[', '2', ']', '<-', 'igaz']],
                [0, ['ki', ':', 'tas6', '[', '1', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#30', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['tas6', '[', '2', ']', '<-', 'hamis']],
                [0, ['ki', ':', 'tas6', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['hamis']);
        });
        it('Végre kell hajtani a kifejezéseket#31', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'rekord', '.', 'intField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#32', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '.', 'intField', '<-', '15']],
                [0, ['ki', ':', 'rekord', '.', 'intField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['15']);
        });
        it('Végre kell hajtani a kifejezéseket#33', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordWithArray', '.', 'intArrayField', '[', '2', ']', '<-', '15']],
                [0, ['ki', ':', 'recordWithArray', '.', 'intArrayField', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['15']);
        });
        it('Végre kell hajtani a kifejezéseket#34', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '.', 'strField', '<-', '"abcd"']],
                [0, ['ki', ':', 'rekord', '.', 'strField', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['b']);
        });
        it('Végre kell hajtani a kifejezéseket#35', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArray', '[', '1', ']', '.', 'strField', '<-', '"abcd"']],
                [0, ['ki', ':', 'recordArray', '[', '1', ']', '.', 'strField', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['b']);
        });
        it('Végre kell hajtani a kifejezéseket#36', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArray', '[', '2', ']', '.', 'intField', '<-', '10']],
                [0, ['ki', ':', 'recordArray', '[', '2', ']', '.', 'intField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['10']);
        });
        it('Végre kell hajtani a kifejezéseket#37', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '.', 'strField', '<-', '"asdasdasd"']],
                [0, ['ki', ':', 'rekord', '.', 'strField', '[', '100', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#38', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['be', ':', 'rekord']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#39', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'rekord', '.', 'unsetted']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#40', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'recordArray', '[', '5', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#41', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'recordArray', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#42', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArrayWithArray', '[', '2', ']', '.', 'strField', '<-', '"asd"']],
                [0, ['ki', ':', 'recordArrayWithArray', '[', '2', ']', '.', 'strField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['asd']);
        });
        it('Végre kell hajtani a kifejezéseket#43', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArrayWithArray', '[', '2', ']', '.', 'intArrayField', '[', '2', ']', '<-', '10']],
                [0, ['ki', ':', 'recordArrayWithArray', '[', '2', ']', '.', 'intArrayField', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['10']);
        });
        it('Végre kell hajtani a kifejezéseket#44', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '.', 'intField', '<-', '100']],
                [0, ['rekord2', '<-', 'rekord']],
                [0, ['rekord', '.', 'intField', '<-', '200']],
                [0, ['ki', ':', 'rekord', '.', 'intField']],
                [0, ['ki', ':', 'rekord2', '.', 'intField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row, Structures.Row, Structures.OutOrder, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            await controlFlows[3].execute();
            await controlFlows[4].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['200', '100']);
        });
        it('Végre kell hajtani a kifejezéseket#45', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '<-', 'recordArray']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#46', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '<-', 'recordArrayWithArray', '[', '3', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#47', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '<-', '"asd"']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#48', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['rekord', '<-', '48']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#49', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['ki', ':', 'rekord']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#50', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['be', ':', 'rekord']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#51', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArray', '[', '1', ']', '.', 'intField', '<-', '100']],
                [0, ['rekord2', '<-', 'recordArray', '[', '1', ']']],
                [0, ['recordArray', '[', '1', ']', '.', 'intField', '<-', '200']],
                [0, ['ki', ':', 'recordArray', '[', '1', ']', '.', 'intField']],
                [0, ['ki', ':', 'rekord2', '.', 'intField']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row, Structures.Row, Structures.OutOrder, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            await controlFlows[3].execute();
            await controlFlows[4].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['200', '100']);
        });
        it('Végre kell hajtani a kifejezéseket#52', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArrayWithArray', '[', '1', ']', '.', 'intArrayField', '[', '3', ']', '<-', '100']],
                [0, ['recordWithArray', '<-', 'recordArrayWithArray', '[', '1', ']']],
                [0, ['recordArrayWithArray', '[', '1', ']', '.', 'intArrayField', '[', '3', ']', '<-', '200']],
                [0, ['ki', ':', 'recordWithArray', '.', 'intArrayField', '[', '3', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row, Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            await controlFlows[3].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['100']);
        });
        it('Végre kell hajtani a kifejezéseket#53', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordArrayWithArray', '[', '1', ']', '.', 'strArrField', '[', '1', ']', '<-', '"ABC"']],
                [0, ['KI', ':', 'recordArrayWithArray', '[', '1', ']', '.', 'strArrField', '[', '1', ']', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['B']);
        });
        it('Végre kell hajtani a kifejezéseket#54', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['T10', '[', '1', ']', '<-', '5']],
                [0, ['ki', ':', 't10', '[', '1', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['5']);
        });
        it('Végre kell hajtani a kifejezéseket#55', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['recordarraywitharray', '[', '1', ']', '.', 'strarrfield', '[', '1', ']', '<-', '"ABC"']],
                [0, ['KI', ':', 'recordArrayWithArray', '[', '1', ']', '.', 'strArrField', '[', '1', ']', '[', '2', ']']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['B']);
        });
    });
});
