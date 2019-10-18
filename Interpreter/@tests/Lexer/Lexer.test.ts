import * as chai from 'chai';

import {MinorInterpreterError} from '../../Error/MinorInterpreterError';
import {InstanceRegister} from '../InstanceRegister';

const expect = chai.expect;

const lexer = InstanceRegister.getLexer();

describe('LexerClass', () => {
    describe('-separateString', () => {
        const separateString = lexer['separateString'];
        separateString.bind(lexer);

        it('Jól kell szétdarabolnia a sorokat#1', () => {
            expect(separateString('1+15')) .to.deep.equal(['1', '+', '15']);
        });
        it('Jól kell szétdarabolnia a sorokat#2', () => {
            expect(separateString('ab15')) .to.deep.equal(['ab15']);
        });
        it('Jól kell szétdarabolnia a sorokat#3', () => {
            expect(separateString('15-(1)+a[0]')).to.deep.equal(['15', '-', '(', '1', ')', '+', 'a', '[', '0', ']']);
        });
        it('Jól kell szétdarabolnia a sorokat#4', () => {
            expect(separateString('((1+1)--15)')).to.deep.equal(['(', '(', '1', '+', '1', ')', '-', '-', '15', ')']);
        });
        it('Jól kell szétdarabolnia a sorokat#5', () => {
            expect(separateString('-11.15+(+0.6)')).to.deep.equal(['-', '11.15', '+', '(', '+', '0.6', ')']);
        });
        it('Jól kell szétdarabolnia a sorokat#7', () => {
            expect(separateString('"156 7asd " +" +1 -1 * asdasd " + \'h\'')).to.deep.equal(['"156 7asd "', '+', '" +1 -1 * asdasd "', '+', '\'h\'']);
        });
        it('Jól kell szétdarabolnia a sorokat#8', () => {
            expect(separateString('valtozo<-!true')).to.deep.equal(['valtozo', '<-', '!', 'true']);
        });
        it('Jól kell szétdarabolnia a sorokat#9', () => {
            expect( () => { separateString('15ab'); }).to.throw(MinorInterpreterError);
        });
        it('Üres string esetén üres tömböt kell visszaadnia', () => {
            expect(separateString('')).to.deep.equal([]);
        });
    });
    describe('-countLeftSpaces', () => {
        const countLeftSpaces = lexer['countLeftSpaces'];
        it('Üres string esetében 0', () => {
            expect(countLeftSpaces('')).to.equal(0);
        });
        it('Csak space karakterek esetében is 0', () => {
            expect(countLeftSpaces('       ')).to.equal(0);
        });
        it('Bal oldali space karaktrek számítása#1', () => {
            expect(countLeftSpaces(' asd')).to.equal(1);
        });
        it('Bal oldali space karaktrek számítása#2', () => {
            expect(countLeftSpaces('    -1     ')).to.equal(4);
        });
        it('Bal oldali space karaktrek számítása#3', () => {
            expect(countLeftSpaces('     asd')).to.equal(5);
        });
        it('Bal oldali space karaktrek számítása#4', () => {
            expect(countLeftSpaces('  ()')).to.equal(2);
        });
    });
    describe('+processCode', () => {
        it('Kommenteket üres sorokkal kell helyettesítenie#1', () => {
            expect(lexer.processCode('15\n/*Ez itt komment*/15')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: ['15']},
                {leftSpaces: 0, rowNumber: 2, codeArray: ['15']},
            ]);
        });
        it('Kommenteket üres sorokkal kell helyettesítenie#2', () => {
            expect(lexer.processCode('1/* Több \n soros \n komment */\n2')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: ['1']},
                {leftSpaces: 0, rowNumber: 2, codeArray: []},
                {leftSpaces: 0, rowNumber: 3, codeArray: []},
                {leftSpaces: 0, rowNumber: 4, codeArray: ['2']},
            ]);
        });
        it('Kommenteket üres sorokkal kell helyettesítenie#3', () => {
            expect(lexer.processCode('/*Ez itt egy komment*/1/**/+/*Másik*/2')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: ['1', '+', '2']},
            ]);
        });
        it('Kommenteket üres sorokkal kell helyettesítenie#4', () => {
            expect(lexer.processCode('/*Ez \nitt\n egy komment*/1\n/*Másik*/2')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: []},
                {leftSpaces: 0, rowNumber: 2, codeArray: []},
                {leftSpaces: 0, rowNumber: 3, codeArray: ['1']},
                {leftSpaces: 0, rowNumber: 4, codeArray: ['2']},
            ]);
        });
        it('Üres string esetén 1 IRow üres tömbbel', () => {
            expect(lexer.processCode('')).to.deep.equal([{leftSpaces: 0, rowNumber: 1, codeArray: []}]);
        });
        it('Sorszámozás ellenörzése', () => {
            expect(lexer.processCode('\n\n\n\n\n\n\n')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: []},
                {leftSpaces: 0, rowNumber: 2, codeArray: []},
                {leftSpaces: 0, rowNumber: 3, codeArray: []},
                {leftSpaces: 0, rowNumber: 4, codeArray: []},
                {leftSpaces: 0, rowNumber: 5, codeArray: []},
                {leftSpaces: 0, rowNumber: 6, codeArray: []},
                {leftSpaces: 0, rowNumber: 7, codeArray: []},
                {leftSpaces: 0, rowNumber: 8, codeArray: []},
            ]);
        });
        it('Egyszerű valós példa#1', () => {
            expect(lexer.processCode('while i < 10\n    KI: i')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: ['while', 'i', '<', '10']},
                {leftSpaces: 4, rowNumber: 2, codeArray: ['KI', ':', 'i']},
            ]);
        });
        it('Egyszerű valós példa#2', () => {
            expect(lexer.processCode('BE: szam\nif szam * 2 < szam + 10\n    KI: "Helyes!"')).to.deep.equal([
                {leftSpaces: 0, rowNumber: 1, codeArray: ['BE', ':', 'szam']},
                {leftSpaces: 0, rowNumber: 2, codeArray: ['if', 'szam', '*', '2', '<', 'szam', '+', '10']},
                {leftSpaces: 4, rowNumber: 3, codeArray: ['KI', ':', '"Helyes!"']},
            ]);
        });
    });
});
