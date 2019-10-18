import * as chai from 'chai';

import * as Variable from '../../Variable';
import {MyArray} from '../../Variable/MyArray';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const variableBuilder = InstanceRegister.getVariableBuilder();

describe('VariableBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens = ['asd', '"a"', 'string'];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', Variable.Variable]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens: any[] = [];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens = [''];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens = ['num', '<-', 'num', '+', '1'];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Variable.Variable, 'string', Variable.Variable, 'string', 'string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens = ['  a  '];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string']);
        });
        it('Referenciának kell lennie a változó értékének', () => {
            const tokens: any[] = ['string', 'string'];
            const str = 'Valami 12345';
            variableBuilder.process(tokens);
            (tokens[0] as Variable.Variable<any>).setValue(str);
            expect((tokens[1] as Variable.Variable<any>).getValue()).to.equal(str);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens = ['t10'];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [MyArray]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens = ['asd', '"a"', 'STRING'];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', Variable.Variable]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens = ['asd', '"a"', 'STring'];
            variableBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', Variable.Variable]);
        });
    });
});
