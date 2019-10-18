import * as chai from 'chai';

import * as Variable from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';
import * as Utils from '../TestUtils';

const expect = chai.expect;

const valueBuilder = InstanceRegister.getValueBuilder();

describe('ValueBuilder', () => {
    describe('+process', () => {
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#1', () => {
            const tokens = ['15', '+', '\'a\''];
            valueBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Variable.Value, 'string', Variable.Value]);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#2', () => {
            const tokens: any[] = [];
            valueBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, []);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#3', () => {
            const tokens = [''];
            valueBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, ['string']);
        });
        it('Jól kell felismernie és kicserélnie a tokeneket a megfelelő osztályokra#4', () => {
            const tokens = ['"   asd  "', '" 15 "', '\'\''];
            valueBuilder.process(tokens);
            Utils.checkTypesInArray(tokens, [Variable.Value, Variable.Value, 'string']);
        });
    });
});
