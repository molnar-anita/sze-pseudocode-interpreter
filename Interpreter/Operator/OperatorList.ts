import {Cast} from '../Cast/Cast';
import {MinorRuntimeError} from '../Error';
import * as Type from '../Type';
import {TypeRegister} from '../Type';
import {IGettable, isGettable, isMyRecord, isSettable, Value} from '../Variable';
import {ExecutionWayTypes} from './ExecutionWayTypes';
import {IOperatorLevel} from './IOperatorLevel';
import {Operator} from './Operator';
import {OperatorTypes} from './OperatorTypes';

export class OperatorList {
    public static loadAndGetOperatorStructure(typeRegister: TypeRegister, caster: Cast): IOperatorLevel[] {
        let levelIndex: number = 0;
        let executionWay;
        return [
            {
                executionWay: executionWay = ExecutionWayTypes.LeftToRight,
                levelIndex,
                operators: [
                    new Operator(typeRegister, levelIndex, 'Pozitív előjel', ['+'], OperatorTypes.OneSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName]),  (a) => {
                        return new Value(a.type, a.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Negatív előjel', ['-'], OperatorTypes.OneSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName]),  (a) => {
                        return new Value(a.type, -a.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Tagadás', ['!', 'NOT'], OperatorTypes.OneSide, executionWay, [typeRegister.getSimpleTypeByName(Type.Boolean.typeName)], (a) => {
                        return new Value(a.type, !a.getValue());
                    }),
                ],
            },
            {
                executionWay: executionWay = ExecutionWayTypes.LeftToRight,
                levelIndex: ++levelIndex,
                operators: [
                    new Operator(typeRegister, levelIndex, 'Szorzás', ['*'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        const value = a.getValue() * b.getValue();
                        if (a.type.name === Type.Integer.typeName && ( value > Type.Integer.maximum || value < Type.Integer.minimum )) {
                            throw new MinorRuntimeError('Szorzás operátor', 'Az egész típus szorzatának bele kell férnie az egész típusba. ' + Type.Integer.minimum + ' <= x <= ' + Type.Integer.maximum);
                        }
                        return new Value(a.type, value);
                    }),
                    new Operator(typeRegister, levelIndex, 'Osztás',  ['/'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        const value = a.getValue() / b.getValue();
                        if (b.getValue() === 0 || b.getValue() === 0.0) {
                            throw new MinorRuntimeError('Osztás operátor', '0-val nem lehet osztani.');
                        }
                        if (!isFinite(value)) {
                            throw new MinorRuntimeError('Osztás operátor', 'Az osztás eredménye végtelen. (' + a.getValue() + '/' + b.getValue() + ')');
                        }

                        if (!Number.isInteger(value)) {
                            return new Value(typeRegister.getSimpleTypeByName(Type.Real.typeName), value);
                        }
                        if (a.type.name === Type.Integer.typeName && ( value > Type.Integer.maximum || value < Type.Integer.minimum )) {
                            throw new MinorRuntimeError('Osztás operátor', 'Az osztás eredményének utána bele kell férnie az egész típusba. ' + Type.Integer.minimum + ' <= x <= ' + Type.Integer.maximum);
                        }
                        return new Value(a.type, value);
                    }),
                    new Operator(typeRegister, levelIndex, 'Egész osztás', ['DIV'], OperatorTypes.TwoSide, executionWay, [typeRegister.getSimpleTypeByName(Type.Integer.typeName)], (a, b) => {
                        if (b.getValue() === 0) {
                            throw new MinorRuntimeError('Egész osztás operátor', '0-val nem lehet osztani.');
                        }
                        return new Value(typeRegister.getSimpleTypeByName(Type.Integer.typeName), Math.floor(a.getValue() / b.getValue()));
                    }),
                    new Operator(typeRegister, levelIndex, 'Maradék', ['%', 'MOD'], OperatorTypes.TwoSide, executionWay, [typeRegister.getSimpleTypeByName(Type.Integer.typeName)], (a, b) => {
                        if (b.getValue() === 0) {
                            throw new MinorRuntimeError('Maradék operátor', 'Mivel 0-val nem lehet osztani ezért annak a maradékának sincs értelme.');
                        }
                        return new Value(typeRegister.getSimpleTypeByName(Type.Integer.typeName), a.getValue() % b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'És', ['&&', 'AND'], OperatorTypes.TwoSide, executionWay, [typeRegister.getSimpleTypeByName(Type.Boolean.typeName)], (a, b) => {
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() && b.getValue());
                    }),
                ],
            },
            {
                executionWay: executionWay = ExecutionWayTypes.LeftToRight,
                levelIndex: ++levelIndex,
                operators: [
                    new Operator(typeRegister, levelIndex, 'Összeadás', ['+'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName, Type.String.typeName, Type.Character.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        const value = a.getValue() + b.getValue();
                        if (a.type.name === Type.Integer.typeName && ( value > Type.Integer.maximum || value < Type.Integer.minimum )) {
                            throw new MinorRuntimeError('Osztás operátor', 'Az osztás eredményének utána bele kell férnie az egész típusba. ' + Type.Integer.minimum + ' <= x <= ' + Type.Integer.maximum);
                        }
                        if (a.type.name === Type.Character.typeName && b.type.name === Type.Character.typeName) {
                            return new Value(typeRegister.getSimpleTypeByName(Type.String.typeName), value);
                        }
                        return new Value(a.type, value);
                    }),
                    new Operator(typeRegister, levelIndex, 'Kivonás', ['-'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        const value = a.getValue() - b.getValue();
                        if (a.type.name === Type.Integer.typeName && ( value > Type.Integer.maximum || value < Type.Integer.minimum )) {
                            throw new MinorRuntimeError('Osztás operátor', 'Az osztás eredményének utána bele kell férnie az egész típusba. ' + Type.Integer.minimum + ' <= x <= ' + Type.Integer.maximum);
                        }
                        return new Value(a.type, value);
                    }),
                    new Operator(typeRegister, levelIndex, 'Vagy', ['||', 'OR'], OperatorTypes.TwoSide, executionWay, [typeRegister.getSimpleTypeByName(Type.Boolean.typeName)], (a, b) => {
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() || b.getValue());
                    }),
                ],
            },
            {
                executionWay: executionWay = ExecutionWayTypes.LeftToRight,
                levelIndex: ++levelIndex,
                operators: [
                    new Operator(typeRegister, levelIndex, 'Egyenlő', ['='], OperatorTypes.TwoSide, executionWay, typeRegister.getAllSimpleTypeAsArray(), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.type === b.type && a.getValue() === b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Nem egyenlő', ['<>'], OperatorTypes.TwoSide, executionWay, typeRegister.getAllSimpleTypeAsArray(), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.type !== b.type || a.getValue() !== b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Kisebb', ['<'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName, Type.String.typeName, Type.Character.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() < b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Kisebb egyenlő', ['<='], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName, Type.String.typeName, Type.Character.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() <= b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Nagyobb', ['>'], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName, Type.String.typeName, Type.Character.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() > b.getValue());
                    }),
                    new Operator(typeRegister, levelIndex, 'Nagyobb egyenlő', ['>='], OperatorTypes.TwoSide, executionWay, typeRegister.getSimpleTypesByNames([Type.Integer.typeName, Type.Real.typeName, Type.String.typeName, Type.Character.typeName]), (a, b) => {
                        a = caster.castTwoIGettable(a, b);
                        b = caster.castTwoIGettable(b, a);
                        return new Value(typeRegister.getSimpleTypeByName(Type.Boolean.typeName), a.getValue() >= b.getValue());
                    }),
                ],
            },
            {
                executionWay: executionWay = ExecutionWayTypes.RightToLeft,
                levelIndex: ++levelIndex,
                operators: [
                    new Operator(typeRegister, levelIndex, 'Értékadás', ['<-'], OperatorTypes.TwoSide, executionWay, typeRegister.getAllAsArray(), (a, b) => {
                        if (isMyRecord(a) && isMyRecord(b) && a.type === b.type) {
                            a.setFields(b.getFields());
                            return a;
                        }
                        if (!isSettable(a)) {
                            throw new MinorRuntimeError( 'Értékadás operátor', 'Értékadás esetén a bal oldali operátornak muszály változónak lennie!' );
                        }
                        if (isGettable(a)) {
                            b = caster.hardCastTwoIGettable(b, (a as IGettable));
                            a.setValue(b.getValue());
                        }
                        return a;
                    }),
                ],
            },
        ];
    }
    private constructor() {}
}
