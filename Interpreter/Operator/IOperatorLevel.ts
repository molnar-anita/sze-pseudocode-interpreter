import {ExecutionWayTypes} from './ExecutionWayTypes';
import {Operator} from './Operator';

export interface IOperatorLevel {
    executionWay: ExecutionWayTypes;
    levelIndex: number;
    operators: Operator[];
}
