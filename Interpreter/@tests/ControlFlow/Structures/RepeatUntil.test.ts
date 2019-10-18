import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('RepeatUntil', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['repeat']],
                [10, ['KI', ':', '1']],
                [5, ['until', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.RepeatUntil]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1']);
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', '0']],
                [5, ['repeat']],
                [10, ['num', '<-', 'num', '+', '1']],
                [10, ['KI', ':', 'num']],
                [5, ['until', 'num', '=', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.RepeatUntil]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1', '2', '3', '4', '5']);
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', '0']],
                [5, ['repeat']],
                [10, ['num', '<-', 'num', '-', '1']],
                [5, ['until', 'num', '=', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.RepeatUntil]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['repeat']],
                [10, ['num', '<-', '0']],
                [5, ['until', '100']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.RepeatUntil]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['repeat']],
                [10, ['num', '<-', '0']],
                [5, ['until', 'igaz', '+', 'hamis']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.RepeatUntil]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['Repeat']],
                [10, ['KI', ':', '1']],
                [5, ['unTIl', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.RepeatUntil]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1']);
        });
    });
});
