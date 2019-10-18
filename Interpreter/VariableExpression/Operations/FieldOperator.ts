import {MinorRuntimeError} from '../../Error';
import {isMyRecord, MyRecord} from '../../Variable';
import {IVariableExpressionOperation} from '../IVariableExpressionOperation';

export class FieldOperator implements IVariableExpressionOperation {
    public readonly name: string = 'Mező';
    public readonly fieldOperator = true;

    public constructor(private fieldName: string) {}

    public execute(element: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!isMyRecord(element)) {
                return reject( new MinorRuntimeError('Mező', 'Csak rekordnak lehet a mezőjét lekérdezni!') );
            } else {
                return resolve( (element as MyRecord).getField(this.fieldName) );
            }
        });
    }
}

export function isFieldOperator(it: any): it is FieldOperator {
    return (it as FieldOperator).fieldOperator !== undefined;
}
