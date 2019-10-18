import * as chai from 'chai';

import {MinorRuntimeError} from '../../Error';
import {IGettable} from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';

const expect = chai.expect;

const expressionBuilder = InstanceRegister.getExpressionBuilder();

describe('FunctionList', () => {
    describe('Mathematical functions', async () => {
        describe('ABS', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['ABS', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['ABS', '(', '-', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['ABS', '(', '-', '0', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['ABS', '(', '0.15', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0.15);
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const result = await expressionBuilder.build(['ABS', '(', '-', '0.55', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0.55);
            });
        });
        describe('EXP', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['EXP', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.exp(1));
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['EXP', '(', '-', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.exp(-2));
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['EXP', '(', '-', '2.5', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.exp(-2.5));
            });
        });
        describe('LOG', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['LOG', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.log(1));
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['LOG', '(', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.log(2));
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['LOG', '(', '2.5', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.log(2.5));
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const e = await expressionBuilder.build(['LOG', '(', '0', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const e = await expressionBuilder.build(['LOG', '(', '-', '10', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
        describe('SIN', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['SIN', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.sin(1));
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['SIN', '(', '-', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.sin(-2));
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['SIN', '(', '-', '2.5', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.sin(-2.5));
            });
        });
        describe('COS', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['COS', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.cos(1));
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['COS', '(', '-', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.cos(-2));
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['COS', '(', '-', '2.5', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(Math.cos(-2.5));
            });
        });
        describe('SQR', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['SQR', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['SQR', '(', '-', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(4);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['SQR', '(', '5', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(25);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['SQR', '(', '0', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
        });
        describe('SQRT', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['SQRT', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['SQRT', '(', '0', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['SQRT', '(', '9', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(3);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const e = await expressionBuilder.build(['SQRT', '(', '-', '1', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
        describe('RANDOM', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['RANDOM', '(', '1', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const row = expressionBuilder.build(['RANDOM', '(', '10', ')']);
                for (let i = 0; i < 100; i++) {
                    const result = ((await row.execute()) as IGettable).getValue();
                    expect(result).is.below(10);
                    expect(result).is.least(0);
                }
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const e = await expressionBuilder.build(['RANDOM', '(', '-', '10', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const e = await expressionBuilder.build(['RANDOM', '(', '0', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
    });
    describe('String functions', async () => {
        describe('LENGTH', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['LENGTH', '(', '"12345"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(5);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['LENGTH', '(', `'2'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['LENGTH', '(', '""', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['LENGTH', '(', '"   "', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(3);
            });
        });
        describe('COPY', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['COPY', '(', '"12345"', ',', '1', ',', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('12');
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['COPY', '(', '""', ',', '1', ',', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('');
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['COPY', '(', '"ABCDEFG"', ',', '3', ',', '2', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('CD');
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['COPY', '(', '"12345"', ',', '3', ',', '10', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('345');
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const e = await expressionBuilder.build(['COPY', '(', '"12345"', ',', '0', ',', '10', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#6', async () => {
                const e = await expressionBuilder.build(['COPY', '(', '"12345"', ',', '1', ',', '-', '2', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
        describe('POS', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['POS', '(', '"6"', ',', '"12345"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['POS', '(', '"6"', ',', '""', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(0);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['POS', '(', '"1"', ',', '"111111"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['POS', '(', '"232"', ',', '"123212321"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(2);
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const result = await expressionBuilder.build(['POS', '(', '\'0\'', ',', '"12321012321"' , ')']).execute();
                expect((result as IGettable).getValue()).to.equal(6);
            });
        });
        describe('VAL', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['VAL', '(', '"12345"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(12345);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['VAL', '(', '"12.25"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(12.25);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['VAL', '(', '"-12345"', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(-12345);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['VAL', '(', '\'1\'', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(1);
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const e = await expressionBuilder.build(['VAL', '(', '"12345.12.12"', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#6', async () => {
                const e = await expressionBuilder.build(['VAL', '(', '"..15"', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#7', async () => {
                const e = await expressionBuilder.build(['VAL', '(', '"--15"', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#8', async () => {
                const e = await expressionBuilder.build(['VAL', '(', '"AAA"', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#9', async () => {
                const e = await expressionBuilder.build(['VAL', '(', '""', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
        describe('STR', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['STR', '(', '12345', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('12345');
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['STR', '(', '12.25', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('12.25');
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['STR', '(', '-', '12345', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('-12345');
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['STR', '(', '0', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('0');
            });
        });
    });
    describe('Character functions', async () => {
        describe('ASC functions', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'A'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(65);
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `' '`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(32);
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'a'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(97);
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'á'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(160);
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'Á'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(181);
            });
            it('Helyes eredménnyel fut le#6', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'ő'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(139);
            });
            it('Helyes eredménnyel fut le#7', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'Ő'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(138);
            });
            it('Helyes eredménnyel fut le#8', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'ű'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(251);
            });
            it('Helyes eredménnyel fut le#9', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'Ű'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(235);
            });
            it('Helyes eredménnyel fut le#10', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'í'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(161);
            });
            it('Helyes eredménnyel fut le#11', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'Í'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(214);
            });
            it('Helyes eredménnyel fut le#12', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'ü'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(129);
            });
            it('Helyes eredménnyel fut le#13', async () => {
                const result = await expressionBuilder.build(['ASC', '(', `'Ü'`, ')']).execute();
                expect((result as IGettable).getValue()).to.equal(154);
            });
            it('Helyes eredménnyel fut le#14', async () => {
                const e = await expressionBuilder.build(['ASC', '(', `'ʆ'`, ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#15', async () => {
                const e = await expressionBuilder.build(['ASC', '(', `';'`, ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#16', async () => {
                const e = await expressionBuilder.build(['ASC', '(', `'߉'`, ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
        describe('CHR functions', async () => {
            it('Helyes eredménnyel fut le#1', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '65', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('A');
            });
            it('Helyes eredménnyel fut le#2', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '66', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('B');
            });
            it('Helyes eredménnyel fut le#3', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '32', ')']).execute();
                expect((result as IGettable).getValue()).to.equal(' ');
            });
            it('Helyes eredménnyel fut le#4', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '97', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('a');
            });
            it('Helyes eredménnyel fut le#5', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '181', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('Á');
            });
            it('Helyes eredménnyel fut le#6', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '251', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('ű');
            });
            it('Helyes eredménnyel fut le#7', async () => {
                const result = await expressionBuilder.build(['CHR', '(', '138', ')']).execute();
                expect((result as IGettable).getValue()).to.equal('Ő');
            });
            it('Helyes eredménnyel fut le#8', async () => {
                const e = await expressionBuilder.build(['CHR', '(', '-', '1', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#9', async () => {
                const e = await expressionBuilder.build(['CHR', '(', '600', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
            it('Helyes eredménnyel fut le#10', async () => {
                const e = await expressionBuilder.build(['CHR', '(', '1000', ')']).execute().catch((e) => e);
                expect(e).is.instanceOf(MinorRuntimeError);
            });
        });
    });
});
