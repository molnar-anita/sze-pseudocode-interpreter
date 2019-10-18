import {IMinorExpressionBuilder} from '../Builder';
import {Cast} from '../Cast/Cast';
import {TypeRegister} from '../Type';
import {ExecutionWayTypes} from './ExecutionWayTypes';
import {IOperatorBySign} from './IOperatorBySign';
import {IOperatorLevel} from './IOperatorLevel';
import {isOperator} from './Operator';
import {OperatorList} from './OperatorList';
import {OperatorTypes} from './OperatorTypes';

export class OperatorBuilder implements IMinorExpressionBuilder {
    public name: string = 'Operátor építő';
    private operatorList: IOperatorLevel[] ;
    private oneSideOperators: IOperatorBySign;
    private twoSideOperators: IOperatorBySign;

    constructor(private typeRegister: TypeRegister, private caster: Cast) {
        this.operatorList = OperatorList.loadAndGetOperatorStructure(this.typeRegister, this.caster);

        const oneSide: IOperatorBySign = {};
        const twoSide: IOperatorBySign = {};
        for (const level of this.operatorList) {
            for (const operator of level.operators) {
                for (const sign of operator.signs) {
                    if (operator.type === OperatorTypes.OneSide) {
                        oneSide[sign] = operator;
                    } else {
                        twoSide[sign] = operator;
                    }
                }
            }
        }
        this.oneSideOperators = oneSide;
        this.twoSideOperators = twoSide;
    }

    public process(arr: any[]): void {
        for (const n in arr) {
            const i: number = Number(n);
            if (typeof arr[i] === 'string') {
                const oneSideOperator = this.oneSideOperators[arr[i].toUpperCase()];
                const twoSideOperator = this.twoSideOperators[arr[i].toUpperCase()];
                if (oneSideOperator !== undefined && twoSideOperator !== undefined) {
                    if (i > 0 &&
                        arr[i - 1] !== '(' &&
                        arr[i - 1] !== ',' &&
                        !isOperator( arr[i - 1] )) {
                        arr[i] = twoSideOperator;
                    } else {
                        arr[i] = oneSideOperator;
                    }
                } else if (oneSideOperator !== undefined) {
                    arr[i] = oneSideOperator;
                } else if (twoSideOperator !== undefined) {
                    arr[i] = twoSideOperator;
                }
            }
        }
    }

    public getExecutionWay(levelIndex: number): ExecutionWayTypes {
        return this.operatorList[levelIndex].executionWay;
    }
}
