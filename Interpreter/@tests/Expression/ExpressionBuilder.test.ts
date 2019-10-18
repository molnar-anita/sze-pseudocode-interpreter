import * as chai from 'chai';

import * as Error from '../../Error';
import * as Expression from '../../Expression';
import {ExpressionBuilder} from '../../Expression';
import * as Operator from '../../Operator';
import * as Variable from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const expressionBuilder = InstanceRegister.getExpressionBuilder();

describe('ExpressionBuilder', () => {
    describe('-getOperatorLevels', () => {
        const getOperatorLevels = ExpressionBuilder['getOperatorLevels'];
        it('Az operátor szinteknek megfelelőnek kell lennie#1', () => {
            const tokens: any[] = ['b', '<-', 'igaz'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [4] );
        });
        it('Az operátor szinteknek megfelelőnek kell lennie#2', () => {
            const tokens: any[] = ['b'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [] );
        });
        it('Az operátor szinteknek megfelelőnek kell lennie#3', () => {
            const tokens: any[] = ['num', '<-', '(', '-', '15', ')', '*', '(', '100', '+', '1.5', ')'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [1, 4] );
        });
        it('Az operátor szinteknek megfelelőnek kell lennie#4', () => {
            const tokens: any[] = ['b', '+', '1', '*', '2'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [1, 2] );
        });
        it('Az operátor szinteknek megfelelőnek kell lennie#5', () => {
            const tokens: any[] = ['1', '*', '1', '*', '1', '*', '1', '*', '1', '*', '1', '*', '1', '*', '1', '*', '1'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [1] );
        });
        it('Az operátor szinteknek megfelelőnek kell lennie#6', () => {
            const tokens: any[] = ['b', '>=', '0', '&&', 'NOT', 'igaz'];
            const expression = expressionBuilder.build(tokens);
            expect( expression['operatorLevels'].map((x) => x.levelIndex) ).to.deep.equal( [0, 1, 3] );
        });
    } );
    describe('+build', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens: any[] = ['b', '<-', 'igaz'];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], [Variable.Variable, Operator.Operator, Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens: any[] = ['b', '<-', '(', 'igaz', '&&', 'hamis', ')'];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], [Variable.Variable, Operator.Operator, Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][2]['executionArray'], [Variable.Value, Operator.Operator, Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens: any[] = [];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens: any[] = ['num', '<-', '(', '-', '15', ')', '*', '(', '100', '+', '1.5', ')'];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], [Variable.Variable, Operator.Operator, Expression.Expression, Operator.Operator, Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][2]['executionArray'], [Operator.Operator, Variable.Value]);
            Utils.checkTypesInArray(expression['executionArray'][4]['executionArray'], [Variable.Value, Operator.Operator, Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens: any[] = ['num', '<-', '(', '-', '(', '15.1', ')', ')'];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], [Variable.Variable, Operator.Operator, Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][2]['executionArray'], [Operator.Operator, Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][2]['executionArray'][1]['executionArray'], [Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens: any[] = ['(', '(', '(', '"szöveg"', ')', ')', ')'];
            const expression = expressionBuilder.build(tokens);
            Utils.checkTypesInArray(expression['executionArray'], [Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][0]['executionArray'], [Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][0]['executionArray'][0]['executionArray'], [Expression.Expression]);
            Utils.checkTypesInArray(expression['executionArray'][0]['executionArray'][0]['executionArray'][0]['executionArray'], [Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens: any[] = ['(', '1'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens: any[] = ['ilyenValtozoNincs'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#9', () => {
            const tokens: any[] = ['(', '1', '('];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#10', () => {
            const tokens: any[] = ['(', ')', '1', ')'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#11', () => {
            const tokens: any[] = [')'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#12', () => {
            const tokens: any[] = ['(', '1', ')', '*', '(', '(', '15', '+', '15', ')'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#13', () => {
            const tokens: any[] = ['(', '(', '1'];
            expect(() => expressionBuilder.build(tokens)).to.throw(Error.MinorInterpreterError);
        });
    });
});
