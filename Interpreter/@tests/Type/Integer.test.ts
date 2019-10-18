
import * as chai from 'chai';

const expect = chai.expect;

import { MinorInterpreterError } from '../../Error/MinorInterpreterError';
import { MinorRuntimeError } from '../../Error/MinorRuntimeError';
import * as Type from '../../Type';

describe('Integer', () => {
    const int = new Type.Integer();
    describe('+checkToken', () => {
        it('Jól detektálja a tokeneket#1', () => {
            expect(int.checkToken('1')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#2', () => {
            expect(int.checkToken('123456789123456789')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#3', () => {
            expect(int.checkToken('')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#4', () => {
            expect(int.checkToken('1a1')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#5', () => {
            expect(int.checkToken('0')) .to.equal(true);
        });
    });

    describe('+checkConsoleInput', () => {
        it('Jól detektálja a konzolról érkező inputokat#1', () => {
            expect(int.checkConsoleInput('156')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#2', () => {
            expect(int.checkConsoleInput(' 123 ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#3', () => {
            expect(int.checkConsoleInput(' ')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#4', () => {
            expect(int.checkConsoleInput('+1')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#5', () => {
            expect(int.checkConsoleInput('-111')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#6', () => {
            expect(int.checkConsoleInput('    +15 ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#7', () => {
            expect(int.checkConsoleInput('   -999 ')) .to.equal(true);
        });
    });

    describe('+getValueFromToken', () => {
        it('Jól konvertálja-e át a tokeneket#1', () => {
            expect(int.getValueFromToken('123')).to.equal(123);
        });
        it('Jól konvertálja-e át a tokeneket#2', () => {
            expect(int.getValueFromToken('000555')).to.equal(555);
        });
        it('Jól konvertálja-e át a tokeneket#3', () => {
            expect(int.getValueFromToken('123456')).to.equal(123456);
        });
        it('a konvertált szám belefér-e a 32 bit-be#1', () => {
            expect( () => int.getValueFromToken(Math.pow(2, 32).toString()) ).to.throw(MinorInterpreterError);
        });
        it('a konvertált szám belefér-e a 32 bit-be#2', () => {
            expect( () => int.getValueFromToken(Math.pow(2, 31).toString()) ).to.throw(MinorInterpreterError);
        });
    });

    describe('+getValueFromConsoleInput', () => {
        it('Jól konvertálja-e át a konzolról kapott inputokat#1', () => {
            expect(int.getValueFromConsoleInput('  -15  ')).to.equal(-15);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#2', () => {
            expect(int.getValueFromConsoleInput('+1')).to.equal(1);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#3', () => {
            expect( () => int.getValueFromConsoleInput(' -' + Math.pow(2, 31).toString()) ).to.throw(MinorRuntimeError);
        });
    });
});
