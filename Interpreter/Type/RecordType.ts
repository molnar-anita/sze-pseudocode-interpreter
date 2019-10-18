import {IVariableInputFormat} from '../Variable';
import {IndexOperator} from '../VariableExpression/Operations/IndexOperator';
import {IType} from './IType';

export class RecordType implements IType {
    public recordType = true;
    constructor(public name: string, public fieldList: Map<string, IVariableInputFormat>) {}
}

export function isRecordType(it: any): it is RecordType {
    return (it as RecordType).recordType !== undefined;
}
