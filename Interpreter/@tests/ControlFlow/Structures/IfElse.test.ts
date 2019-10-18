import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('IfElse', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'igaz']],
                [5, ['KI', ':', '"hello"']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['hello']);
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis']],
                [5, ['KI', ':', '"hello"']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal([]);
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis']],
                [5, ['KI', ':', '1']],
                [0, ['else', 'if', 'igaz']],
                [5, ['KI', ':', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['2']);
        });
        it('Végre kell hajtani a kifejezéseket#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'igaz']],
                [5, ['KI', ':', '1']],
                [0, ['else', 'if', 'igaz']],
                [5, ['KI', ':', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1']);
        });
        it('Végre kell hajtani a kifejezéseket#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis']],
                [5, ['KI', ':', '1']],
                [0, ['else', 'if', 'hamis']],
                [5, ['KI', ':', '2']],
                [0, ['else', 'if', 'hamis']],
                [5, ['KI', ':', '3']],
                [0, ['else', 'if', 'hamis']],
                [5, ['KI', ':', '4']],
                [0, ['else', 'if', 'igaz']],
                [5, ['KI', ':', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['5']);
        });
        it('Végre kell hajtani a kifejezéseket#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'igaz']],
                [5, ['KI', ':', '1']],
                [0, ['else']],
                [5, ['KI', ':', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['1']);
        });
        it('Végre kell hajtani a kifejezéseket#7', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis']],
                [5, ['KI', ':', '1']],
                [0, ['else']],
                [5, ['KI', ':', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['2']);
        });
        it('Végre kell hajtani a kifejezéseket#8', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', '100']],
                [5, ['KI', ':', '1']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#9', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis']],
                [5, ['KI', ':', '1']],
                [0, ['else', 'if', '100']],
                [5, ['KI', ':', '5']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#10', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['if', 'hamis', '+', '15']],
                [5, ['KI', ':', '1']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Végre kell hajtani a kifejezéseket#11', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [0, ['If', 'hamis']],
                [5, ['KI', ':', '1']],
                [0, ['eLSe', 'iF', 'igaz']],
                [5, ['KI', ':', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.IfElse]);
            await controlFlows[0].execute();
            expect(testConsole.getWroteMessages()).to.deep.equal(['2']);
        });
    });
});
