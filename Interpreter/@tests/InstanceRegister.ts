import {Cast} from '../Cast/Cast';
import {ControlFlowBuilder} from '../ControlFlow/ControlFlowBuilder';
import * as Structures from '../ControlFlow/Structures';
import {ExpressionBuilder} from '../Expression';
import {Lexer} from '../Lexer';
import {OperatorBuilder} from '../Operator';
import {RecordTypeRegister, TypeRegister} from '../Type';
import * as Type from '../Type';
import * as Variable from '../Variable';
import {VariableExpressionBuilder, VariableExpressionOperatorBuilder} from '../VariableExpression';
import {TestConsole} from './Console/TestConsole';
import {FunctionBuilder} from "../Function";

interface InstanceStore {
    [key: string]: any;
}

export class InstanceRegister {
    public static getTypeRegister(): Type.TypeRegister {
        const typeRegister: Type.TypeRegister = this.getInstance('typeRegister', () => {
            return new Type.TypeRegister([
                new Type.Boolean(),
                new Type.Integer(),
                new Type.Real(),
                new Type.Character(),
                new Type.String(),
            ]);
        } );
        const recordTypeRegister = this.getRecordTypeRegister(typeRegister);
        typeRegister.addTypes(recordTypeRegister.getAllAsArray());
        return typeRegister;
    }

    public static getRecordTypeRegister(typeRegister: TypeRegister): RecordTypeRegister {
        return this.getInstance('recordTypeRegister', () => new RecordTypeRegister(typeRegister, [
                {
                    fields: [
                        {
                            arrayLength: 0,
                            arraySecondDimensionLength: 0,
                            isArray: false,
                            isRecord: false,
                            isTwoDimensionalArray: false,
                            name: 'strField',
                            type: Type.String.typeName,
                        },
                        {
                            arrayLength: 0,
                            arraySecondDimensionLength: 0,
                            isArray: false,
                            isRecord: false,
                            isTwoDimensionalArray: false,
                            name: 'intField',
                            type: Type.Integer.typeName,
                        },
                    ],
                    name: 'rekord1',
                },
            {
                fields: [
                    {
                        arrayLength: 0,
                        arraySecondDimensionLength: 0,
                        isArray: false,
                        isRecord: false,
                        isTwoDimensionalArray: false,
                        name: 'strField',
                        type: Type.String.typeName,
                    },
                    {
                        arrayLength: 0,
                        arraySecondDimensionLength: 0,
                        isArray: false,
                        isRecord: false,
                        isTwoDimensionalArray: false,
                        name: 'unsetted',
                        type: Type.Boolean.typeName,
                    },
                    {
                        arrayLength: 10,
                        arraySecondDimensionLength: 0,
                        isArray: true,
                        isRecord: false,
                        isTwoDimensionalArray: false,
                        name: 'intArrayField',
                        type: Type.Integer.typeName,
                    },
                    {
                        arrayLength: 5,
                        arraySecondDimensionLength: 0,
                        isArray: true,
                        isRecord: false,
                        isTwoDimensionalArray: false,
                        name: 'strArrField',
                        type: Type.String.typeName,
                    },
                ],
                name: 'recordWithArray',
            },
            ]),
        );
    }

    public static getCaster(): Cast {
        return this.getInstance('caster', () => new Cast(this.getTypeRegister()));
    }

    public static getOperatorBuilder(): OperatorBuilder {
        return this.getInstance('operatorBuilder', () => new OperatorBuilder(this.getTypeRegister(), this.getCaster()));
    }

    public static getValueBuilder(): Variable.ValueBuilder {
        return this.getInstance('valueBuilder', () => new Variable.ValueBuilder(this.getTypeRegister()));
    }

    public static getVariableBuilder(): Variable.VariableBuilder {
        return this.getInstance('variableBuilder', () => new Variable.VariableBuilder(this.getTypeRegister(), [
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'string',
                type: Type.String.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: true,
                isTwoDimensionalArray: false,
                name: 'rekord',
                type: 'rekord1',
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: true,
                isTwoDimensionalArray: false,
                name: 'rekord2',
                type: 'rekord1',
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: true,
                isTwoDimensionalArray: false,
                name: 'recordWithArray',
                type: 'recordWithArray',
            },
            {
                arrayLength: 10,
                arraySecondDimensionLength: 0,
                isArray: true,
                isRecord: true,
                isTwoDimensionalArray: false,
                name: 'recordArrayWithArray',
                type: 'recordWithArray',
            },
            {
                arrayLength: 10,
                arraySecondDimensionLength: 0,
                isArray: true,
                isRecord: true,
                isTwoDimensionalArray: false,
                name: 'recordArray',
                type: 'rekord1',
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'num',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'num2',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'real',
                type: Type.Real.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'c',
                type: Type.Character.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'b',
                type: Type.Boolean.typeName,
            },
            {
                arrayLength: 10,
                arraySecondDimensionLength: 0,
                isArray: true,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 't10',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 5,
                arraySecondDimensionLength: 10,
                isArray: true,
                isRecord: false,
                isTwoDimensionalArray: true,
                name: 't5x10',
                type: Type.Boolean.typeName,
            },
            {
                arrayLength: 5,
                arraySecondDimensionLength: 0,
                isArray: true,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'tu5',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 5,
                arraySecondDimensionLength: 4,
                isArray: true,
                isRecord: false,
                isTwoDimensionalArray: true,
                name: 'tu5x4',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 6,
                arraySecondDimensionLength: 0,
                isArray: true,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'tas6',
                type: Type.Boolean.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'unsetted',
                type: Type.Integer.typeName,
            },
            {
                arrayLength: 0,
                arraySecondDimensionLength: 0,
                isArray: false,
                isRecord: false,
                isTwoDimensionalArray: false,
                name: 'aftersetted',
                type: Type.Integer.typeName,
            },
        ]));
    }

    public static getVariableExpressionOperatorBuilder(): VariableExpressionOperatorBuilder {
        return this.getInstance('variableExpressionOperatorBuilder', () => new VariableExpressionOperatorBuilder(InstanceRegister.getTypeRegister()));
    }

    public static getVariableExpressionBuilder(): VariableExpressionBuilder {
        return this.getInstance('variableExpressionBuilder', () => new VariableExpressionBuilder(InstanceRegister.getTypeRegister()));
    }

    public static getFunctionBuilder(): FunctionBuilder {
        return this.getInstance('functionBuilder', () => new FunctionBuilder(this.getTypeRegister(), this.getCaster()));
    }

    public static getExpressionBuilder(): ExpressionBuilder {
        return this.getInstance('expressionBuilder', () => new ExpressionBuilder([
            this.getOperatorBuilder(),
            this.getValueBuilder(),
            this.getVariableExpressionOperatorBuilder(),
            this.getVariableBuilder(),
            this.getVariableExpressionBuilder(),
            this.getFunctionBuilder(),
        ]));
    }

    public static getControlFlowBuilder(): ControlFlowBuilder {
        return this.getInstance('controlFlowBuilder', () => new ControlFlowBuilder([
            Structures.InOrder.getRules(),
            Structures.OutOrder.getRules(),
            Structures.IfElse.getRules(),
            Structures.For.getRules(),
            Structures.RepeatUntil.getRules(),
            Structures.While.getRules(),
        ], this.getExpressionBuilder(), this.getTestConsole()));
    }

    public static getTestConsole(): TestConsole {
        const t = (this.getInstance('testConsole', () => new TestConsole()) as TestConsole);
        t.clean();
        return t;
    }

    public static getLexer(): Lexer {
        return this.getInstance('lexer', () => new Lexer());
    }

    private static instances: InstanceStore = {};

    private static getInstance(name: string, generateInstance: () => any): any {
        if (!InstanceRegister.instances.hasOwnProperty(name)) {
            InstanceRegister.instances[name] = generateInstance();
        }
        return InstanceRegister.instances[name];
    }
}
