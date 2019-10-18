import {ARRAY_START_INDEX, MAX_ARRAY_SIZE_PER_DIMENSION} from '../Config';
import {MinorInterpreterError, MinorRuntimeError} from '../Error';
import {isRecordType, isSimpleType, IType, TypeRegister} from '../Type';
import {ITypeable} from './ITypeable';
import {MyRecord} from './MyRecord';

export class MyArray implements ITypeable {
    public readonly dimensions: number;
    private readonly className = 'Tömb';
    private values: any[] = [];
    private isSetted: boolean[] = [];

    private readonly fullSize: number;

    public constructor(public readonly name: string, private dimensionsSize: number[], public type: IType, private typeRegister: TypeRegister) {
        this.dimensions = dimensionsSize.length;
        if (this.dimensions > 2) {
            throw new MinorInterpreterError(this.className, 'Maximum csak két dimenziós tömböt lehet megadni!');
        }
        if (dimensionsSize[0] > MAX_ARRAY_SIZE_PER_DIMENSION || (this.dimensions === 2 && dimensionsSize[1] > MAX_ARRAY_SIZE_PER_DIMENSION)) {
            throw new MinorInterpreterError(this.className, 'Egy tömb mérete nem lehet nagyobb dimenziónként ' + MAX_ARRAY_SIZE_PER_DIMENSION + '-nál!');
        }
        if (dimensionsSize[0] <= 0 || (this.dimensions === 2 && dimensionsSize[1] <= 0)) {
            throw new MinorInterpreterError(this.className, 'Egy tömb méretének legalább egynek kell lennie!');
        }

        this.fullSize = this.calculateFullSize();

        this.isSetted = new Array(this.fullSize);
        this.values = new Array(this.fullSize);
        this.isSetted.map(() => false);
    }

    public getValueByIndex(first: number, second?: number): any {
        const index = this.calculateIndex(first, second);
        if (isRecordType( this.type )) {
            // Lazy load
            if (!this.isSetted[index]) {
                const name = second ? (`${this.name}[${first}, ${second}]`) : (`${this.name}[${first}]`);
                this.values[index] = new MyRecord(name, this.type, this.typeRegister);
                this.isSetted[index] = true;
            }
            return this.values[index];
        }
        if (!this.isSetted[index]) {
            throw new MinorRuntimeError(this.className, 'A tömb elemének nincs beállítva érték!');
        }
        return this.values[index];
    }

    public setValueByIndex(value: any, first: number, second?: number): void {
        const index = this.calculateIndex(first, second);
        this.isSetted[index] = true;
        return this.values[index] = value;
    }

    public isIndexInside(first: number, second?: number): boolean {
        return this.calculateIndex(first, second) >= 0;
    }

    public clone(name?: string): MyArray {
        if (!name) {
            name = this.name;
        }
        const newArray = new MyArray(name, this.dimensionsSize, this.type, this.typeRegister);
        newArray.values = [...this.values];
        newArray.isSetted = [...this.isSetted];
        return newArray;
    }

    private calculateFullSize(): number {
        if (this.dimensions === 1) {
            return this.dimensionsSize[0];
        } else if (this.dimensions === 2) {
            return this.dimensionsSize[0] * this.dimensionsSize[1];
        }
    }

    private calculateIndex(first: number, second?: number): number {
        if (this.dimensions === 1 && second) {
            throw new MinorRuntimeError(this.className, 'Egy dimenziós tömbből történt próbálkozás kétdimenziós lekérdezésre');
        }
        if (this.dimensions === 1) {
            if (ARRAY_START_INDEX > 0 && first < ARRAY_START_INDEX) {
                throw new MinorRuntimeError(this.className, 'Az indexelés ' + ARRAY_START_INDEX + '-től indul!');
            }
            const index = first - ARRAY_START_INDEX;
            if (index < 0 || index >= this.dimensionsSize[0]) {
                throw new MinorRuntimeError(this.className, 'A index a tömbön kívülre mutat');
            }
            return index;
        } else if (this.dimensions === 2) {
            if (!second) {
                throw new MinorRuntimeError(this.className, 'Egy két dimenziós tömbből, csak mind a két dimenzió megadásával lehet hivatkozni egy elemre');
            }
            if (ARRAY_START_INDEX > 0 && first < ARRAY_START_INDEX) {
                throw new MinorRuntimeError(this.className, 'Az indexelés ' + ARRAY_START_INDEX + '-től indul!');
            }
            const firstIndex = first - ARRAY_START_INDEX;
            if (firstIndex < 0 || firstIndex >= this.dimensionsSize[0]) {
                throw new MinorRuntimeError(this.className, 'Az első indexe a tömbön kívülre mutat');
            }
            if (ARRAY_START_INDEX > 0 && second < ARRAY_START_INDEX) {
                throw new MinorRuntimeError(this.className, 'Az indexelés ' + ARRAY_START_INDEX + '-től indul!');
            }
            const secondIndex = second - ARRAY_START_INDEX;
            if (secondIndex < 0 || secondIndex >= this.dimensionsSize[1]) {
                throw new MinorRuntimeError(this.className, 'A második indexe a tömbön kívülre mutat');
            }
            return firstIndex + (secondIndex * this.dimensionsSize[1]);
        }
    }
}

export function isMyArray(it: any): it is MyArray {
    return (it as MyArray).getValueByIndex !== undefined;
}
