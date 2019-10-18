import {IExecutable} from '../Expression';
import {IGettable, MyRecord} from '../Variable';
import {MyArray} from '../Variable/MyArray';
import {IVariableExpressionOperation} from './IVariableExpressionOperation';

export class VariableExpression implements IExecutable {
    private readonly name = 'Változó kifejezés';
    public constructor(private mainElement: MyArray | MyRecord | IGettable, private operations: IVariableExpressionOperation[]) {}

    public async execute(): Promise<any> {
        let element = this.mainElement;
        for (const operation of this.operations) {
            element = await operation.execute(element);
        }
        return element;
    }
}
