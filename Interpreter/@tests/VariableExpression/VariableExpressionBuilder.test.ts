import * as chai from 'chai';

import {MinorInterpreterError} from '../../Error';
import {MyRecord} from '../../Variable';
import {MyArray, VariableExpression} from '../../VariableExpression/index';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const variableExpressionOperatorBuilder = InstanceRegister.getVariableExpressionOperatorBuilder();
const variableBuilder = InstanceRegister.getVariableBuilder();
const variableExpressionBuilder = InstanceRegister.getVariableExpressionBuilder();

function process(tokens: any[]): void {
    variableExpressionOperatorBuilder.process(tokens);
    variableBuilder.process(tokens);
    variableExpressionBuilder.process(tokens);
}

describe('VariableExpressionBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens = ['t10'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [MyArray]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens = ['t10', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens = ['t10', '[', '0', '+', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens = ['t5x10'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [MyArray]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#5', () => {
            const tokens = ['5', '*', 't5x10', '[', '1', ',', '1', ']', '+', '15'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', VariableExpression, 'string', 'string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#6', () => {
            const tokens = ['t10', '[', '1', ']', '<-', 't10', '[', '2', ']', '+', 't10', '[', '3', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression, 'string', VariableExpression, 'string', VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#7', () => {
            const tokens: any[] = [];
            process(tokens);
            Utils.checkTypesInArray(tokens, []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#8', () => {
            const tokens = ['[', ']'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#9', () => {
            const tokens = ['t10', '[', '1', '+' , '2'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#10', () => {
            const tokens = ['15', '[', '1', ']'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#11', () => {
            const tokens: any[] = ['t10', '[', 'num', ']', '<-', '10'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression, 'string', 'string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#12', () => {
            const tokens: any[] = ['ki', ':', 't10', '[', 'num', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#13', () => {
            const tokens: any[] = ['string', '[', '1', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#14', () => {
            const tokens = ['t10', '[', '1', ',', '2', ',', '3', ']'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#15', () => {
            const tokens = ['t10', '[', '1', ',', '2', ',', '3'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#16', () => {
            const tokens: any[] = ['ki', ':', 't10', '[', 't10', '[', '1', ']', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#17', () => {
            const tokens: any[] = ['ki', ':', 'rekord'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', MyRecord]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#18', () => {
            const tokens: any[] = ['ki', ':', 'rekord', '.', 'intField'];
            process(tokens);
            Utils.checkTypesInArray(tokens, ['string', 'string', VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#19', () => {
            const tokens: any[] = ['rekord', '<-', 'rekord2'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [MyRecord, 'string', MyRecord]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#20', () => {
            const tokens = ['t10', '.', 'field'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#21', () => {
            const tokens = ['125', '.', 'field'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#22', () => {
            const tokens = ['str', '.', 'field'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#23', () => {
            const tokens = ['.', 'field'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#24', () => {
            const tokens = ['rekord', '.'];
            expect( () => process(tokens) ).to.throw(MinorInterpreterError);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#25', () => {
            const tokens: any[] = ['recordArrayWithArray', '[', '1', ']', '.', 'intArrayField', '[', '3', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#26', () => {
            const tokens: any[] = ['recordwitharray', '.', 'intarrayfield', '[', '3', ']'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [VariableExpression]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#27', () => {
            const tokens = ['T10'];
            process(tokens);
            Utils.checkTypesInArray(tokens, [MyArray]);
        });
    });
});
