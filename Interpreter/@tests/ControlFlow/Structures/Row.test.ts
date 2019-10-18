import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('Row', () => {
    describe('+execute', async () => {
        it('Végre kell hajtani a kifejezéseket#1', async () => {
            testConsole.clean();
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', '15']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Végre kell hajtani a kifejezéseket#2', async () => {
            testConsole.clean();
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', '15']],
                [5, ['num', '<-', 'num', '*', '10']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.Row, Structures.OutOrder]);
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            await controlFlows[2].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('150');
        });
        it('Végre kell hajtani a kifejezéseket#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['igaz', '-', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
        });
    });
});
