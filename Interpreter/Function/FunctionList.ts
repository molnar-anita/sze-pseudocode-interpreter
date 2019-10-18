import {CP852} from '../CodePageTable/CP852';
import {ARRAY_START_INDEX} from '../Config';
import {MinorRuntimeError} from '../Error';
import * as Type from '../Type';
import {Value} from '../Variable';
import {MyFunction} from './MyFunction';

export class FunctionList {
    public static getFunctions(typeRegister: Type.TypeRegister): Map<string, MyFunction> {
        const tr = (name: string) => typeRegister.getSimpleTypeByName(name);
        const map = new Map<string, MyFunction>();
        const list = [
            /* Matematikai függvények */
            new MyFunction('ABS', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.Real.typeName), Math.abs( args[0].getValue() ));
            }),
            new MyFunction('EXP', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.Real.typeName), Math.exp( args[0].getValue() ));
            }),
            new MyFunction('LOG', [tr(Type.Real.typeName)], (args) => {
                const x = args[0].getValue();
                if (x <= 0) { throw new MinorRuntimeError('Log függvény', 'A természetes logaritmus függvény csak 0-nál nagyobb szám esetében értelmezett!'); }
                return new Value(tr(Type.Real.typeName), Math.log( x ));
            }),
            new MyFunction('SIN', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.Real.typeName), Math.sin( args[0].getValue() ));
            }),
            new MyFunction('COS', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.Real.typeName), Math.cos( args[0].getValue() ));
            }),
            new MyFunction('SQR', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.Real.typeName), Math.pow( args[0].getValue(), 2 ));
            }),
            new MyFunction('SQRT', [tr(Type.Real.typeName)], (args) => {
                const x = args[0].getValue();
                if (x < 0) { throw new MinorRuntimeError('Sqrt függvény', 'A gyökfüggvény 0-nál nagyobb szám esetében értelmezett! (Imaginárius számok kezelése nem támogatott)'); }
                return new Value(tr(Type.Real.typeName), Math.sqrt( x ));
            }),
            new MyFunction('RANDOM', [tr(Type.Integer.typeName)], (args) => {
                const x = args[0].getValue();
                if (x < 1) { throw new MinorRuntimeError('Random függvény', 'Az \'X\'-nek legalább egy-nek kell lennie! A függvény 0-tól X-1-ig állít elő véletlen számokat.'); }
                return new Value(tr(Type.Integer.typeName), Math.floor(Math.random() * x));
            }),

            /* Sztring függvények */
            new MyFunction('LENGTH', [tr(Type.String.typeName)], (args) => {
                return new Value(tr(Type.Integer.typeName), args[0].getValue().length);
            }),
            new MyFunction('COPY', [tr(Type.String.typeName), tr(Type.Integer.typeName), tr(Type.Integer.typeName)], (args) => {
                const startIndex = args[1].getValue();
                const count = args[2].getValue();
                if (startIndex < ARRAY_START_INDEX) {
                    throw new MinorRuntimeError('Copy függvény', `A másolás első indexének legalább ${ARRAY_START_INDEX}-nek lennie!`);
                }
                if (count < 0) {
                    throw new MinorRuntimeError('Copy függvény', 'A másolandó karakterek száma nem lehet negatív!');
                }
                return new Value(tr(Type.String.typeName), args[0].getValue().substr(startIndex - ARRAY_START_INDEX, count));
            }),
            new MyFunction('POS', [tr(Type.String.typeName), tr(Type.String.typeName)], (args) => {
                return new Value(tr(Type.Integer.typeName), args[1].getValue().indexOf(args[0].getValue()) + ARRAY_START_INDEX);
            }),
            new MyFunction('VAL', [tr(Type.String.typeName)], (args) => {
                const result = parseFloat( args[0].getValue() );
                if (isNaN(result) || !tr(Type.Real.typeName).checkConsoleInput(args[0].getValue())) {
                    throw new MinorRuntimeError('Val függvény', `A(z) "${args[0].getValue()}"-t nem lehetett számmá alakítani!`);
                }
                return new Value(tr(Type.Real.typeName), result );
            }),
            new MyFunction('STR', [tr(Type.Real.typeName)], (args) => {
                return new Value(tr(Type.String.typeName), args[0].getConsoleOutput());
            }),

            /* Karakter függvények */
            new MyFunction('ASC', [tr(Type.Character.typeName)], (args) => {
                let characterCode = 0;
                try {
                    characterCode = CP852.getCharacterCode(args[0].getValue());
                } catch (e) {
                    throw new MinorRuntimeError('Asc függvény', (e as Error).message);
                }
                return new Value(tr(Type.Integer.typeName), characterCode);
            }),
            new MyFunction('CHR', [tr(Type.Integer.typeName)], (args) => {
                let character: string;
                try {
                    character = CP852.getCharacter(args[0].getValue());
                } catch (e) {
                    throw new MinorRuntimeError('Chr függvény', (e as Error).message);
                }
                return new Value(tr(Type.Character.typeName), character);
            }),
        ];
        list.forEach((x) => map.set(x.name, x));
        return map;
    }
}
