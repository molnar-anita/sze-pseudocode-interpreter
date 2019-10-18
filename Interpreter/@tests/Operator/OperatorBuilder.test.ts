import * as chai from 'chai';

import * as Operator from '../../Operator';
import * as Variable from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const typeRegister = InstanceRegister.getTypeRegister();

const operatorList = Operator.OperatorList.loadAndGetOperatorStructure( typeRegister, InstanceRegister.getCaster() );
const operatorBuilder = InstanceRegister.getOperatorBuilder();

const findOperator = (sign: string, operatorType: Operator.OperatorTypes): Operator.Operator => {
    for (const level of operatorList) {
        for (const operator of level.operators) {
            if (operator.type === operatorType && operator.signs.indexOf(sign) >= 0) {
                return operator;
            }
        }
    }
    return undefined;
};

describe('OperatorBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens: any[] = [new Variable.Value(typeRegister.getByName('int'), 1), '+', '\'a\''];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Variable.Value, Operator.Operator, 'string']);
            expect((tokens[1] as Operator.Operator).name).to.equal(findOperator('+', Operator.OperatorTypes.TwoSide).name);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens: any[] = [];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens: any[] = [''];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens: any[] = ['(', '-', '15', ')', '+', '41'];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string', Operator.Operator, 'string', 'string', Operator.Operator, 'string']);
            expect((tokens[1] as Operator.Operator).name).to.equal(findOperator('-', Operator.OperatorTypes.OneSide).name);
            expect((tokens[4] as Operator.Operator).name).to.equal(findOperator('+', Operator.OperatorTypes.TwoSide).name);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens: any[] = ['!', '(', '-', '15', '<', '16', ')', '&&', 'true'];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Operator.Operator, 'string', Operator.Operator, 'string', Operator.Operator, 'string', 'string', Operator.Operator, 'string']);
            expect((tokens[0] as Operator.Operator).name).to.equal(findOperator('!',  Operator.OperatorTypes.OneSide).name);
            expect((tokens[2] as Operator.Operator).name).to.equal(findOperator('-',  Operator.OperatorTypes.OneSide).name);
            expect((tokens[4] as Operator.Operator).name).to.equal(findOperator('<',  Operator.OperatorTypes.TwoSide).name);
            expect((tokens[7] as Operator.Operator).name).to.equal(findOperator('&&', Operator.OperatorTypes.TwoSide).name);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens: any[] = ['!', '!', '!', 'true'];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Operator.Operator, Operator.Operator, Operator.Operator, 'string']);
            expect((tokens[0] as Operator.Operator).name).to.equal(findOperator('!', Operator.OperatorTypes.OneSide).name);
            expect((tokens[1] as Operator.Operator).name).to.equal(findOperator('!', Operator.OperatorTypes.OneSide).name);
            expect((tokens[2] as Operator.Operator).name).to.equal(findOperator('!', Operator.OperatorTypes.OneSide).name);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens: any[] = ['-', '(', '15', ')', '+', '(', '1', ')'];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Operator.Operator, 'string', 'string', 'string', Operator.Operator, 'string', 'string', 'string']);
            expect((tokens[0] as Operator.Operator).name).to.equal(findOperator('-', Operator.OperatorTypes.OneSide).name);
            expect((tokens[4] as Operator.Operator).name).to.equal(findOperator('+', Operator.OperatorTypes.TwoSide).name);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens: any[] = ['15', '+', '-', '1'];
            operatorBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string', Operator.Operator, Operator.Operator, 'string']);
            expect((tokens[1] as Operator.Operator).name).to.equal(findOperator('+', Operator.OperatorTypes.TwoSide).name);
            expect((tokens[2] as Operator.Operator).name).to.equal(findOperator('-', Operator.OperatorTypes.OneSide).name);
        });
    });
});
