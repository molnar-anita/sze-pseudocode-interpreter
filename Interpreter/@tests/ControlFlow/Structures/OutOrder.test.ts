import * as chai from 'chai';
import * as Structures from '../../../ControlFlow/Structures';
import {RuntimeError} from '../../../Error';
import {InstanceRegister} from '../../InstanceRegister';
import * as Utils from '../../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();
const testConsole = InstanceRegister.getTestConsole();

describe('OutOrder', () => {
    describe('+execute', () => {
        it('Jól kell kiiratnia a konzolra a meadott adatokat#1', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#2', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '1', ',', '1']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('1 1');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#3', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '""', ',', '1']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('1');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#4', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '""', ',', '1', ',', '""']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('1');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#5', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '""']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#6', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', 'num', '<-', '15', ',', '\' \'', ',', '2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15   2');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#7', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['ki', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#8', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['Ki', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#9', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['kI', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#10', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':', '1', '+', 'hamis']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            const e = await controlFlows[0].execute().catch((e) => e);
            expect(e).is.instanceOf(RuntimeError);
            testConsole.clean();
        });
        it('Jól kell kiiratnia a konzolra a meadott adatokat#11', async () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['Ki', ':', '15']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.OutOrder]);
            await controlFlows[0].execute();
            expect(testConsole.getLastWroteMessage()).to.equal('15');
        });
    });
});
