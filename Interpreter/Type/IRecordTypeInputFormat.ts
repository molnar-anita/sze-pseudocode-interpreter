import {IVariableInputFormat} from '../Variable';

export interface IRecordTypeInputFormat {
    name: string;
    fields: IVariableInputFormat[];
}
