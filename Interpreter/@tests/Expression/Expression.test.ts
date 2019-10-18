import * as chai from 'chai';

import {MinorRuntimeError, RuntimeError} from '../../Error';
import * as Expression from '../../Expression';
import {IGettable} from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';

const expect = chai.expect;

const expressionBuilder = InstanceRegister.getExpressionBuilder();

describe('Expression', () => {
    describe('+execute', async () => {
        it('Végrehajtásnál megfelelő eredményt kell adnia#1', async () => {
            const tokens: any[] = ['hamis', '<>', 'igaz'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(true);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#2', async () => {
            const tokens: any[] = ['1', '+', '2'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(3);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#3', async () => {
            const tokens: any[] = ['1', '-', '2', '*', '2'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(-3);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#4', async () => {
            const tokens: any[] = ['1', '+', '(',  '2', '+', '2.5', ')', '*', '10'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(46);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#5', async () => {
            const tokens: any[] = ['"aaa"', '+', '(',  '\'b\'', '+', '\'c\'', ')'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal('aaabc');
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#6', async () => {
            const tokens: any[] = ['num', '<-', '15'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(15);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#7', async () => {
            const tokens: any[] = ['num', '<-', 'num2', '<-', '20'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(20);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#8', async () => {
            const tokens: any[] = ['15', '+', '(', 'num2', '<-', '20', ')'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(35);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#9', async () => {
            const tokens: any[] = ['"TESZT"'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal('TESZT');
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#10', async () => {
            const tokens: any[] = ['(', ')'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#11', async () => {
            const tokens: any[] = [];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#12', async () => {
            const tokens: any[] = ['5', '+', 'unsetted'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#13', async () => {
            const tokens: any[] = ['unsetted', '<-', 'unsetted', '+', '1'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#14', async () => {
            const tokens: any[] = ['num', '<-', 'unsetted'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#15', async () => {
            const tokens: any[] = ['t10', '[', 'unsetted', ']', '<-', '1'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#16', async () => {
            const tokens: any[] = ['num', '<-', 'aftersetted'];
            const e = await expressionBuilder.build(tokens).execute().catch((e) => e);
            expect(e).is.instanceOf(MinorRuntimeError);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#17', async () => {
            const tokens: any[] = [
                ['aftersetted', '<-', '1'],
                ['num', '<-', 'aftersetted'],
            ];
            await expressionBuilder.build(tokens[0]).execute();
            const result = await expressionBuilder.build(tokens[1]).execute();
            expect((result as IGettable).getValue()).to.equal(1);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#18', async () => {
            const tokens: any[] = ['HaMiS', '<>', 'iGAz'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(true);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#19', async () => {
            const tokens: any[] = ['15', '+', '(', 'Num2', '<-', '20', ')'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(35);
        });
        it('Végrehajtásnál megfelelő eredményt kell adnia#20', async () => {
            const tokens: any[] = ['(', 'Num2', '<-', '20', ')', 'DiV', '4'];
            const result = await expressionBuilder.build(tokens).execute();
            expect((result as IGettable).getValue()).to.equal(5);
        });
    });
});
