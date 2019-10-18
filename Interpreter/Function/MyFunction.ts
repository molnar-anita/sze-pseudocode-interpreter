import {IType} from '../Type';
import {IGettable} from '../Variable';

export class MyFunction {
    public constructor(
        public name: string,
        public argumentsArray: IType[],
        public call: (a: IGettable[]) => IGettable) {}
}
