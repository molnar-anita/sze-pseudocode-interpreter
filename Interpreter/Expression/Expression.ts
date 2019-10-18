import {MinorRuntimeError} from '../Error';
import {ExecutionWayTypes, isOperator, Operator, OperatorTypes} from '../Operator';
import {IGettable, ISettable, isGettable, isMyRecord, MyRecord} from '../Variable';
import {IExecutable, isExecutable} from './IExecutable';
import {IExecutableLevel} from './IExecutableLevel';

export class Expression implements IExecutable {
    public name: string = 'Kifejezés';

    constructor(private executionArray: any[], private operatorLevels: IExecutableLevel[]) {}
    public async execute(): Promise<IGettable | ISettable | MyRecord> {
            const arr: any[] = Object.assign([], this.executionArray);

            for (const operatorLevel of this.operatorLevels) {

                const leftToRight: boolean = (operatorLevel.executionWay === ExecutionWayTypes.LeftToRight);

                for (let i = (leftToRight ? 0 : arr.length - 1);
                     (leftToRight ? (i < arr.length) : (i >= 0));
                     leftToRight ? i++ : i--) {

                    if (isOperator(arr[i])) {
                        const operator = (arr[i] as Operator);
                        if (operator.levelIndex === operatorLevel.levelIndex) {
                            try {
                                if (operator.type === OperatorTypes.OneSide) {
                                    arr.splice(i, 2, operator.execute(await this.calculateValue(arr[i + 1])));
                                } else if (operator.type === OperatorTypes.TwoSide) {
                                    arr.splice(i - 1, 3, operator.execute(await this.calculateValue(arr[i - 1]), await this.calculateValue(arr[i + 1])));
                                    i--;
                                }
                            } catch (e) {
                                throw e;
                            }
                        }
                    }
                }
            }
            if (arr.length !== 1) {
                throw new MinorRuntimeError(this.name, 'Végrehajtás nem egy eredménnyel zárult.');
            }
            try {
                return await this.calculateValue(arr[0]);
            } catch (e) {
                throw e;
            }
    }

    private calculateValue(elem: any): Promise<IGettable | ISettable | MyRecord> {
        return new Promise<IGettable | ISettable | MyRecord>( (resolve, reject) => {
            if (isExecutable(elem)) {
                (elem as IExecutable).execute().then((result) => {
                    return resolve(result);
                }).catch((error) => { reject(error); });
            } else if (isGettable(elem)) {
                return resolve(elem as IGettable);
            } else if (isMyRecord(elem)) {
                return resolve(elem);
            } else {
                return reject(new MinorRuntimeError(this.name, 'Az operátor egyik oldalán nem lekérdezhető adat áll.'));
            }
        });

    }
}
