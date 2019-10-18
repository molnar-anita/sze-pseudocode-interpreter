import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('InOrder', () => {
    describe('+execute', () => {
        it('Jól kell kiíratniaa konzolra a meadott adatokat#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.OutOrder]);
            testConsole.setupNextRead('15');
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Jól kell kiíratniaa konzolra a meadott adatokat#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Jól kell kiíratniaa konzolra a meadott adatokat#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num', ',', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            testConsole.setupNextRead('15');
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Jól kell kiíratniaa konzolra a meadott adatokat#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            testConsole.setupNextRead('asd');
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Jól kell kiíratniaa konzolra a meadott adatokat#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num', '+', 'igaz']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder]);
            testConsole.setupNextRead('asd');
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Jól kell kiíratniaa konzolra a meadott adatokat#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['Be', ':', 'num']],
                [5, ['kI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.OutOrder]);
            testConsole.setupNextRead('15');
            await controlFlows[0].execute();
            await controlFlows[1].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
    });
});
