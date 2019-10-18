import * as chai from 'chai';
import * as Structures from '../../ControlFlow/Structures';
import {InterpreterError} from '../../Error';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const controlFlowBuilder = InstanceRegister.getControlFlowBuilder();

describe('ControlFlowBuilder (Real)', () => {
    describe('+build', () => {
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#1', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['num', '*', '5']],
                [5, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.Row, Structures.OutOrder]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#2', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['for', 'num', ',', '10']],
                [10, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#3', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['for', 'num', ',', '10']],
                [10, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#4', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['for', 'num', ',', '10']],
                [10, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#5', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['for', 'num', '<-', '1', ',', '10', ',', '1', '-', '2']],
                [10, ['KI', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#6', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':', 'num']],
                [5, ['for', 'num', '<-', '1', ',', '10', ',', '1', '-', '2']],
                [10, ['for', 'num2', ',', '100']],
                [15, ['Ki', ':', 'num2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#7', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['while', 'num', '>', '1']],
                [10, ['for', 'num2', ',', '100']],
                [15, ['Ki', ':', 'num2']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.While]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#8', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['repeat']],
                [10, ['for', 'num2', ',', '100']],
                [15, ['Ki', ':', 'num2']],
                [5, ['until', 'b']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.Row, Structures.RepeatUntil]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#9', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['for', 'num2', ',', '15']],
                [10, ['if', 'num2', '<', '5']],
                [15, ['KI', ':', '"<5"']],
                [10, ['else']],
                [15, ['Ki', ':', '">=5"']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.For]);
        });
        it('Jól kell felismernie a valós szabályok szerint a struktúrákat és kicserélnie őket a megfelelő osztályokra#10', () => {
            const controlFlows = controlFlowBuilder.build(Utils.createIRows([
                [5, ['bE', ':', 'num']],
                [5, ['FoR', 'num', ',', '10']],
                [10, ['Ki', ':', 'num']],
            ]));
            Utils.checkTypesInArray(controlFlows, [Structures.InOrder, Structures.For]);
        });

        it('Helyesen kell reagálni hiba esetén#1', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['repeat']],
                [10, ['for', 'num2', ',', '100']],
                [5, ['until', 'b']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#2', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['repeat']],
                [10, ['BE', ':', 'b']],
                [5, ['until']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#3', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['for']],
                [10, ['num', '<-', 'num', '+', 'num']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#4', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['repeat']],
                [5, ['1']],
                [5, ['until', 'b']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#5', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['repeat']],
                [10, ['num2', '<-', '100']],
                [5, ['until']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#6', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['while']],
                [10, ['for', 'num2', ',', '100']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#7', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['for', 'num2', '15']],
                [10, ['if', 'num2', '<', '5']],
                [15, ['KI', ':', '"<5"']],
                [10, ['else']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#8', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['for', 'num2', '15']],
                [10, ['if', 'num2', '<', '5']],
                [15, ['KI', ':', '"<5"']],
                [10, ['else', 'if']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#9', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['num2', '<-', 'ertelmetlen']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#10', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE', ':']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#11', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI', ':']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#12', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['BE']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#13', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['KI']],
            ]))).to.throw(InterpreterError);
        });
        it('Helyesen kell reagálni hiba esetén#14', () => {
            expect( () => controlFlowBuilder.build(Utils.createIRows([
                [5, ['num', '<-', 'num2']],
                [5, ['repeat']],
                [10, ['for', 'num2', ',', '100']],
                [15, ['Ki', ':', 'num2']],
                [0, ['Ki', ':', '15']],
                [5, ['until', 'b']],
            ]))).to.throw(InterpreterError);
        });
    });
});
