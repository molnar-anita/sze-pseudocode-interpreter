
import * as chai from 'chai';

const expect = chai.expect;

import * as Type from '../../Type';

describe('Real', () => {
    const real = new Type.Real();
    describe('+checkToken', () => {
        it('Jól detektálja a tokeneket#1', () => {
            expect(real.checkToken('1')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#2', () => {
            expect(real.checkToken('123456789123456789')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#3', () => {
            expect(real.checkToken('')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#4', () => {
            expect(real.checkToken('1a1')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#5', () => {
            expect(real.checkToken('0')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#6', () => {
            expect(real.checkToken('0.15')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#7', () => {
            expect(real.checkToken('0.')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#8', () => {
            expect(real.checkToken('1561656511.0')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#9', () => {
            expect(real.checkToken('123456789.123456789123456789')) .to.equal(true);
        });
    });

    describe('+checkConsoleInput', () => {
        it('Jól detektálja a konzolról érkező inputokat#1', () => {
            expect(real.checkConsoleInput('156')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#2', () => {
            expect(real.checkConsoleInput(' 1230.0 ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#3', () => {
            expect(real.checkConsoleInput(' ')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#4', () => {
            expect(real.checkConsoleInput(' +1')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#5', () => {
            expect(real.checkConsoleInput('-111.0')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#6', () => {
            expect(real.checkConsoleInput('    +15.00000000 ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#7', () => {
            expect(real.checkConsoleInput('   -999 ')) .to.equal(true);
        });
    });

    describe('+getValueFromToken', () => {
        it('Jól konvertálja-e át a tokeneket#1', () => {
            expect(real.getValueFromToken('0.15')).to.equal(0.15);
        });
        it('Jól konvertálja-e át a tokeneket#2', () => {
            expect(real.getValueFromToken('000.555')).to.equal(0.555);
        });
        it('Jól konvertálja-e át a tokeneket#3', () => {
            expect(real.getValueFromToken('123456')).to.equal(123456);
        });
        it('Jól konvertálja-e át a tokeneket#4', () => {
            expect(real.getValueFromToken('1000.000555')).to.equal(1000.000555);
        });
    });

    describe('+getValueFromConsoleInput', () => {
        it('Jól konvertálja-e át a konzolról kapott inputokat#1', () => {
            expect(real.getValueFromConsoleInput('  -15  ')).to.equal(-15);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#2', () => {
            expect(real.getValueFromConsoleInput('+1')).to.equal(1);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#3', () => {
            expect(real.getValueFromConsoleInput(' 15.0')).to.equal(15.0);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#4', () => {
            expect(real.getValueFromConsoleInput(' -100.0')).to.equal(-100.0);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#5', () => {
            expect(real.getValueFromConsoleInput('1000.0001')).to.equal(1000.0001);
        });
    });
});
