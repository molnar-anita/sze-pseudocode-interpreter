import * as chai from 'chai';

import {FieldOperator} from '../../VariableExpression/Operations/FieldOperator';
import {IndexOperator} from '../../VariableExpression/Operations/IndexOperator';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const variableExpressionOperatorBuilder = InstanceRegister.getVariableExpressionOperatorBuilder();

function process(arr: any[]) {
    variableExpressionOperatorBuilder.process(arr);
}

describe('VariableExpressionOperatorBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens = ['array', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens = ['array', '[', '1', ']', '.', 'field'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator, FieldOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens = ['array', '[', '1', ']', '.', 'field', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator, FieldOperator, IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens = ['rekord', '.', 'field', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', FieldOperator, IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens = ['rekord', '.', 'field'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', FieldOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens = ['rekord', '.', 'field', '.', 'anotherField'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', FieldOperator, FieldOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens = ['stringArray', '[', '1', ']', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator, IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens = new Array<any>();
            process(tokens);
            Utils.checkTypesInArray(tokens, []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#9', () => {
            const tokens = ['recordWithArray', '[', '1', ']', '.', 'intArrayField', '[', '3', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator, FieldOperator, IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#10', () => {
            const tokens = ['array', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#11', () => {
            const tokens = ['aRRay', '[', '1', ']', '.', 'fiEld'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', IndexOperator, FieldOperator]);
        });
    });
});
