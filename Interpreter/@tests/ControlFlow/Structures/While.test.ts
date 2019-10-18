import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('While', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['b', '<-', 'igaz']],
                [0, ['while', 'b']],
                [5, ['b', '<-', 'hamis']],
                [5, ['KI', ':', 'b']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['hamis']);
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['num', '<-', '0']],
                [0, ['while', 'num', '<', '5']],
                [5, ['num', '<-', 'num', '+', '1']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1', '2', '3', '4', '5']);
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['num', '<-', '0']],
                [0, ['while', 'num', '<', '-', '100']],
                [5, ['num', '<-', 'num', '+', '1']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal([]);
        });
        it('Végre kell hajtani a kifejezéseket#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['num', '<-', '0']],
                [0, ['while', 'num', '>', '-', '100']],
                [5, ['num', '<-', 'num', '+', '1']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
            await controlFlows[0].execute();
            const e = await controlFlows[1].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['while', '100']],
                [5, ['num', '<-', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.While]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['while', '1', '+', '"kutya"']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.While]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
        it('Végre kell hajtani a kifejezéseket#7', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['b', '<-', 'igaz']],
                [0, ['WHile', 'b']],
                [5, ['b', '<-', 'hamis']],
                [5, ['KI', ':', 'b']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['hamis']);
        });
    });
});
