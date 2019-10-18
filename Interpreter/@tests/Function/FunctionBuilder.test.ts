import * as chai from 'chai';

import {MinorInterpreterError} from '../../Error';
import {FunctionCaller} from '../../Function';
import {Operator} from '../../Operator';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const expressionBuilder = InstanceRegister.getExpressionBuilder();

function process(arr: any[]) {
    expressionBuilder.build(arr);
}

describe('FunctionBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens = ['ABS', '(', '1', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens = ['ABS', '(', '12', '*', '5', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens = ['ABS', '(', '(', '12', ')', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens = ['ABS', '(', '-', '12', ')', '+', 'ABS', '(', '15', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller, Operator, FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens = ['ABS', '(', 'ABS', '(', '12', ')', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens = ['ABS', '(', 'ABS', '(', '12', ')', '+', 'ABS', '(', '12', ')', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens = ['ABS', '(', 'ABS', '(', '12', ')', ',', 'ABS', '(', '12', ')', ')'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens = ['ABS', '(', ')'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#9', () => {
            const tokens = ['ABS', '(', '1', ',', '1', ')'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#10', () => {
            const tokens = ['ABS', '(', '1'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#11', () => {
            const tokens = ['ABS', '(', '(', '1', ')'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#12', () => {
            const tokens = ['abs', '(', '1', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#13', () => {
            const tokens = ['aBs', '(', '1', ')'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [FunctionCaller]);
        });
    });
});
