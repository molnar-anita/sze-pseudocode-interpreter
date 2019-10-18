
import * as chai from 'chai';

const expect = chai.expect;

import * as Type from '../../Type';

describe('Boolean', () => {
    const bool = new Type.Boolean();
    describe('+checkToken', () => {
        it('Jól detektálja a tokeneket#1', () => {
            expect(bool.checkToken('igaz')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#2', () => {
            expect(bool.checkToken('hamis')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#3', () => {
            expect(bool.checkToken('1')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#4', () => {
            expect(bool.checkToken('0')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#5', () => {
            expect(bool.checkToken('')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#6', () => {
            expect(bool.checkToken('  true   ')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#7', () => {
            expect(bool.checkToken('IGAZ')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#8', () => {
            expect(bool.checkToken('HAMIS')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#9', () => {
            expect(bool.checkToken('HaMis')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#10', () => {
            expect(bool.checkToken('Igaz')) .to.equal(true);
        });
    });

    describe('+checkConsoleInput', () => {
        it('Jól detektálja a konzolról érkező inputokat#1', () => {
            expect(bool.checkConsoleInput('igaz')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#2', () => {
            expect(bool.checkConsoleInput('hamis')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#3', () => {
            expect(bool.checkConsoleInput('1')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#4', () => {
            expect(bool.checkConsoleInput('0')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#5', () => {
            expect(bool.checkConsoleInput('')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#6', () => {
            expect(bool.checkConsoleInput('  igaz   ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#7', () => {
            expect(bool.checkConsoleInput('  HAMIS   ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#8', () => {
            expect(bool.checkConsoleInput('  iGAZ   ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#9', () => {
            expect(bool.checkConsoleInput('  IGAZ   ')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#10', () => {
            expect(bool.checkConsoleInput('IGAZ')) .to.equal(true);
        });
    });

    describe('+getValueFromToken', () => {
        it('Jól konvertálja-e át a tokeneket#1', () => {
            expect(bool.getValueFromToken('igaz')).to.equal(true);
        });
        it('Jól konvertálja-e át a tokeneket#2', () => {
            expect(bool.getValueFromToken('HAMIS')).to.equal(false);
        });
        it('Jól konvertálja-e át a tokeneket#3', () => {
            expect(bool.getValueFromToken('hamis')).to.equal(false);
        });
    });

    describe('+getValueFromConsoleInput', () => {
        it('Jól konvertálja-e át a konzolról kapott inputokat#1', () => {
            expect(bool.getValueFromConsoleInput('    igAZ')).to.equal(true);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#2', () => {
            expect(bool.getValueFromConsoleInput('HAMIS')).to.equal(false);
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#3', () => {
            expect(bool.getValueFromConsoleInput('hamis      ')).to.equal(false);
        });
    });
});
