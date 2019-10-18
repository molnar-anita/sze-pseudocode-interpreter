import {Cast} from '../Cast/Cast';
import {MinorRuntimeError} from '../Error';
import {Expression, IExecutable} from '../Expression';
import {IType} from '../Type';
import {IGettable, isGettable, Value} from '../Variable';
import {MyFunction} from './MyFunction';

export class FunctionCaller implements IExecutable {
    private name: string = 'Függvény hívó';
    public constructor(private myFunction: MyFunction, private argumentExpressions: Expression[], private caster: Cast) {}

    public async execute(): Promise<any> {
        const argumentsArray: IGettable[] = new Array<IGettable>(this.argumentExpressions.length);
        for (const i in this.argumentExpressions) {
            const type: IType = this.myFunction.argumentsArray[i];
            const result = await this.argumentExpressions[i].execute();
            if (!isGettable(result)) {
                throw new MinorRuntimeError(this.name, `A(z) '${this.myFunction.name}' függvény ${i + 1}. argumentuma hibás!`);
            } else {
                argumentsArray[i] = this.caster.hardCastIGettableToType(result, type);
            }
        }
        return this.myFunction.call(argumentsArray);
    }
}
