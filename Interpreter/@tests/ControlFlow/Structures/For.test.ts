import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('For', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '1', ',', '3']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1', '2', '3']);
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', '-', '3']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['0', '-1', '-2', '-3']);
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', '20', ',', '5']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['0', '5', '10', '15', '20']);
        });
        it('Végre kell hajtani a kifejezéseket#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '10', ',', '3', ',', '1']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal([]);
        });
        it('Végre kell hajtani a kifejezéseket#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'real', '<-', '0', ',', '2', ',', '0.5']],
                [5, ['KI', ':', 'real']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['0', '0.5', '1', '1.5', '2']);
        });
        it('Végre kell hajtani a kifejezéseket#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'real', '<-', '0', ',', '2', ',', '0.5']],
                [5, ['KI', ':', 'real']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['0', '0.5', '1', '1.5', '2']);
        });

        it('Végre kell hajtani a kifejezéseket#7', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', '2', ',', '0.5']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#8', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', '0', ',', '2']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#9', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', 'igaz']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#10', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'string', ',', '2', ',', '0.5']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#11', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', '+', 'igaz', ',', '2', ',', '0.5']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#12', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['num', '<-', '2']],
                [0, ['for', 'num', ',', '3', '+', '1', ',', '2', '-', '1']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.For]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['2', '3', '4']);
        });
        it('Végre kell hajtani a kifejezéseket#13', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', '2', '+', '"a"']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#14', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['for', 'num', '<-', '0', ',', '2', ',', '1', '+', '"a"']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#15', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['FOR', 'num', '<-', '1', ',', '3']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1', '2', '3']);
        });
        it('Végre kell hajtani a kifejezéseket#16', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['FoR', 'num', '<-', '1', ',', '3']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1', '2', '3']);
        });
    });
});
