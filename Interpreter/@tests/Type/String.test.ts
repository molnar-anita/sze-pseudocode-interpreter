
import * as chai from 'chai';

const expect = chai.expect;

import * as Type from '../../Type';

describe('String', () => {
    const str = new Type.String();
    describe('+checkToken', () => {
        it('Jól detektálja a tokeneket#1', () => {
            expect(str.checkToken('""')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#2', () => {
            expect(str.checkToken('"asd"')) .to.equal(true);
        });
        it('Jól detektálja a tokeneket#3', () => {
            expect(str.checkToken('')) .to.equal(false);
        });
        it('Jól detektálja a tokeneket#4', () => {
            expect(str.checkToken('asd')) .to.equal(false);
        });
    });

    describe('+checkConsoleInput', () => {
        it('Jól detektálja a konzolról érkező inputokat#1', () => {
            expect(str.checkConsoleInput('"asdasdas<-asdasda')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#2', () => {
            expect(str.checkConsoleInput('')) .to.equal(true);
        });
        it('Jól detektálja a konzolról érkező inputokat#3', () => {
            expect(str.checkConsoleInput('Valami szöveg')) .to.equal(true);
        });
    });

    describe('+getValueFromToken', () => {
        it('Jól konvertálja-e át a tokeneket#1', () => {
            expect(str.getValueFromToken('""')).to.equal('');
        });
        it('Jól konvertálja-e át a tokeneket#2', () => {
            expect(str.getValueFromToken('"asd"')).to.equal('asd');
        });
        it('Jól konvertálja-e át a tokeneket#3', () => {
            expect(str.getValueFromToken('"<-"')).to.equal('<-');
        });
    });

    describe('+getValueFromConsoleInput', () => {
        const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet mollis nibh, non vestibulum est. Morbi quam quam, interdum eget eleifend at, vehicula sed nunc. Donec sit amet fringilla diam. Nullam sem sapien, aliquet ut eros a, porta viverra diam. Mauris venenatis ipsum turpis, facilisis pellentesque urna ultricies non. Pellentesque id ante quis arcu ultricies hendrerit et vitae mauris. Suspendisse nec felis nibh.';
        it('Jól konvertálja-e át a konzolról kapott inputokat#1', () => {
            expect(str.getValueFromConsoleInput('    ')).to.equal('    ');
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#2', () => {
            expect(str.getValueFromConsoleInput('szöveg')).to.equal('szöveg');
        });
        it('Jól konvertálja-e át a konzolról kapott inputokat#3', () => {
            expect(str.getValueFromConsoleInput(lorem)).to.equal(lorem);
        });
    });
});
