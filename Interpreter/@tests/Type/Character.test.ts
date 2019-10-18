
import * as chai from 'chai';

const expect = chai.expect;

import * as Type from '../../Type';

describe('Character', () => {
    const char = new Type.Character();
    describe('+checkToken', () => {
        it('Jól detektálja a tokeneket#1', () => {
            expect(char.checkToken('\' \'')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#2', () => {
            expect(char.checkToken('\'á\'')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#3', () => {
            expect(char.checkToken('')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#4', () => {
            expect(char.checkToken('á')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#5', () => {
            expect(char.checkToken('a')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#6', () => {
            expect(char.checkToken('  \'a\'   ')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#7', () => {
            expect(char.checkToken('\'5\'')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#8', () => {
            expect(char.checkToken('\'Ő\'')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#9', () => {
            expect(char.checkToken('\'asd\'')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#10', () => {
            expect(char.checkToken('\'\'')) .to.equal(false);
        });
    });

    describe('+checkConsoleInput', () => {
        it('Jól detektálja a konzolról érkező inputokat#1', () => {
            expect(char.checkConsoleInput('a')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#2', () => {
            expect(char.checkConsoleInput('á')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#3', () => {
            expect(char.checkConsoleInput('')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#4', () => {
            expect(char.checkConsoleInput('asd')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#5', () => {
            expect(char.checkConsoleInput('\'ő\'')) .to.equal(false);
        });
        it('Jól detektálja a konzolról érkező inputokat#6', () => {
            expect(char.checkConsoleInput(' ')) .to.equal(true);
        });
    });

    describe('+getValueFromToken', () => {
        it('Jól konvertálja-e át a tokeneket#1', () => {
            expect(char.getValueFromToken('\'a\'')).to.equal('a');
        });
        it('Jól konvertálja-e át a tokeneket#2', () => {
            expect(char.getValueFromToken('\'Ő\'')).to.equal('Ő');
        });
        it('Jól konvertálja-e át a tokeneket#3', () => {
            expect(char.getValueFromToken('\' \'')).to.equal(' ');
        });
    });

    describe('+getValueFromConsoleInput', () => {
        it('Jól konvertálja-e át a konzolról kapott inputokat#1', () => {
            expect(char.getValueFromConsoleInput(' ')).to.equal(' ');
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#2', () => {
            expect(char.getValueFromConsoleInput('Ő')).to.equal('Ő');
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#3', () => {
            expect(char.getValueFromConsoleInput('a')).to.equal('a');
        });
    });
});
