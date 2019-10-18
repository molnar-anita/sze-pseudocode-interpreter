import {MinorRuntimeError} from '../Error';
import {IType, SimpleType, TypeRegister} from '../Type';
import * as Variable from '../Variable';
import {IGettable, ISettable, isMyRecord, MyRecord} from '../Variable';
import {ExecutionWayTypes} from './ExecutionWayTypes';
import {OperatorTypes} from './OperatorTypes';

export class Operator {
    private static moduleName: string = 'Operátor';

    public constructor(
        private typeRegister: TypeRegister,
        public  levelIndex: number,
        public  name: string,
        public  signs: string[],
        public  type: OperatorTypes,
        public  executionWay: ExecutionWayTypes,
        private acceptableTypes: IType[],
        private fn: (a: any, b?: any) => IGettable | ISettable | MyRecord) {}

    public checkSign(sign: string): boolean {
        sign = sign.toUpperCase();
        return this.signs.indexOf(sign) >= 0;
    }

    public execute(param1: any, param2?: any): IGettable | ISettable | MyRecord {
        this.onlyAcceptableTypes(param1);
        if (this.type === OperatorTypes.OneSide) {
            return this.fn(param1);
        }
        this.onlyAcceptableTypes(param2);
        return this.fn(param1, param2);
    }

    // Fontos hogy a különböző operátoroknál csak a megfelelő típusú változókat és értékeket fogadjuk el
    private onlyAcceptableTypes(value: any) {
        if (typeof value === 'undefined' || (!Variable.isGettable(value) && !isMyRecord(value))) {
            throw new MinorRuntimeError(Operator.moduleName + ' - ' + this.name, 'Hibás kifejezés szerepel az operator egyik oldalán.');
        }
        let ok = false;
        for (const type of this.acceptableTypes) {
            if (value.type === type) {
                ok = true;
                break;
            }
        }
        if (!ok) {
            throw new MinorRuntimeError(Operator.moduleName + ' - ' + this.name, 'Nem megengedett típus! A(z) \'' + this.name + '\'-al nem megengedett a "' + value.type.name + '" típus használata.');
        }
    }
}

export function isOperator(it: any): it is Operator {
    return (it as Operator).signs !== undefined;
}
