
import * as chai from 'chai';

import {MinorRuntimeError} from '../../Error/MinorRuntimeError';
import {OperatorList} from '../../Operator/OperatorList';
import * as Type from '../../Type';
import * as Variable from '../../Variable';
import {InstanceRegister} from '../InstanceRegister';

const expect = chai.expect;

const typeRegister = InstanceRegister.getTypeRegister();
const list = OperatorList.loadAndGetOperatorStructure( typeRegister, InstanceRegister.getCaster() );
const variableList = {
    bool: new Variable.Variable('v1', typeRegister.getByName(Type.Boolean.typeName)),
    char: new Variable.Variable('v2', typeRegister.getByName(Type.Character.typeName)),
    int: new Variable.Variable('v3', typeRegister.getByName(Type.Integer.typeName)),
    real: new Variable.Variable('v4', typeRegister.getByName(Type.Real.typeName)),
    string: new Variable.Variable('v5', typeRegister.getByName(Type.String.typeName)),
};
variableList.bool.setValue(true);
variableList.char.setValue('A');
variableList.int.setValue(123);
variableList.real.setValue(123.321);
variableList.string.setValue('szoveg');

const value = (type: string, value: any) => {
    return new Variable.Value(typeRegister.getByName(type), value);
};

describe('OperatorList', () => {
    describe('Operátor szintek ellenörzése (végrehajtási sorrendnél nagyon fontos)', () => {
        for (const listIndex in list) {
            const levelIndex: number = Number(listIndex);
            describe('Level ' + (levelIndex + 1), () => {
                for (const operator of list[listIndex].operators) {
                    it(operator.name + ' operátor ellenörzése', () => {
                        expect( operator.levelIndex ).to.equal(levelIndex);
                    });
                }
            });
        }
    });
    describe('Level 1', () => {
        describe('+ (egy oldalú)', () => {
            const o = list[0].operators[0];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                const val = value(Type.Integer.typeName, 12);
                expect( o.execute(val) ).to.deep.equal(val);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                const val = value(Type.Integer.typeName, -12);
                expect( o.execute(val) ).to.deep.equal(val);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                const val = value(Type.Real.typeName, 10.1);
                expect( o.execute(val) ).to.deep.equal(val);
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( () => { o.execute(variableList.char); } ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(variableList.int) ).to.deep.equal(value(Type.Integer.typeName, 123));
            });
        });
        describe('- (egy oldalú)', () => {
            const o = list[0].operators[1];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( o.execute(value(Type.Integer.typeName, 12)) ).to.deep.equal(value(Type.Integer.typeName, -12));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Integer.typeName, -12)) ).to.deep.equal(value(Type.Integer.typeName, 12));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Real.typeName, -123.321)) ).to.deep.equal(value(Type.Real.typeName, 123.321));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( () => { o.execute(variableList.char); } ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(variableList.int) ).to.deep.equal(value(Type.Integer.typeName, -123));
            });
        });
        describe('!', () => {
            const o = list[0].operators[2];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( o.execute(value(Type.Boolean.typeName, true)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Boolean.typeName, false)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(variableList.bool) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
        });
    });
    describe('Level 2', () => {
        describe('*', () => {
            const o = list[1].operators[0];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, 15), value(Type.String.typeName, 'asd')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( o.execute(value(Type.Integer.typeName, 12), value(Type.Integer.typeName, -1)) ).to.deep.equal(value(Type.Integer.typeName, -12));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Integer.typeName, -12), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Integer.typeName, -1200));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Real.typeName, -123.321), value(Type.Real.typeName, 1000.0)) ).to.deep.equal(value(Type.Real.typeName, -123321));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( () => { o.execute(variableList.char, variableList.real); } ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(variableList.int, variableList.int) ).to.deep.equal(value(Type.Integer.typeName, 15129));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Real.typeName, 15.5), value(Type.Integer.typeName, 10)) ).to.deep.equal(value(Type.Real.typeName, 155));
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, Type.Integer.maximum), variableList.int); } ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#9', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Real.typeName, 0.01)) ).to.deep.equal(value(Type.Real.typeName, 1));
            });
        });
        describe('/', () => {
            const o = list[1].operators[1];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(variableList.string, value(Type.Integer.typeName, 0)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Integer.typeName, 12), value(Type.Integer.typeName, -6)) ).to.deep.equal(value(Type.Integer.typeName, -2));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( () => o.execute(value(Type.Integer.typeName, -1), value(Type.Integer.typeName, 0)) ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Real.typeName, -1000.1), value(Type.Integer.typeName, 10.0)) ).to.deep.equal(value(Type.Real.typeName, -100.01));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( () => { o.execute(variableList.char, value(Type.Integer.typeName, 1)); } ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(variableList.int, variableList.int) ).to.deep.equal(value(Type.Integer.typeName, 1));
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( o.execute(value(Type.Real.typeName, 15.5), value(Type.Real.typeName, 0.1)) ).to.deep.equal(value(Type.Real.typeName, 155));
            });
            it('Jól hajtódik végre az operátor#9', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 20)) ).to.deep.equal(value(Type.Real.typeName, 0.5));
            });
        });
        describe('DIV', () => {
            const o = list[1].operators[2];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.Real.typeName, 10.0), value(Type.Integer.typeName, 1)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, 10), value(Type.Real.typeName, 10.0)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 3)) ).to.deep.equal(value(Type.Integer.typeName, 3));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 11)) ).to.deep.equal(value(Type.Integer.typeName, 0));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( () => o.execute(value(Type.Integer.typeName, 100), value(Type.Integer.typeName, 0)) ).to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(variableList.int, variableList.int) ).to.deep.equal(value(Type.Integer.typeName, 1));
            });
        });
        describe('%', () => {
            const o = list[1].operators[3];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.Real.typeName, 10.0), value(Type.Integer.typeName, 1)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 3)) ).to.deep.equal(value(Type.Integer.typeName, 1));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 15)) ).to.deep.equal(value(Type.Integer.typeName, 10));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(variableList.int, variableList.int) ).to.deep.equal(value(Type.Integer.typeName, 0));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( () => o.execute(variableList.int, value(Type.Integer.typeName, 0)) ).to.throw(MinorRuntimeError);
            });
        });
        describe('&&', () => {
            const o = list[1].operators[4];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.String.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, false)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Boolean.typeName, true), value(Type.Boolean.typeName, false)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Boolean.typeName, true), value(Type.Boolean.typeName, true)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
        });
    });
    describe('Level 3', () => {
        const o = list[2].operators[0];
        describe('+', () => {
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), variableList.int); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, Type.Integer.maximum), variableList.int); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, Type.Integer.minimum), value(Type.Integer.typeName, -1)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), variableList.int); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 3)) ).to.deep.equal(value(Type.Integer.typeName, 13));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Real.typeName, 3.0)) ).to.deep.equal(value(Type.Real.typeName, 13.0));
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( o.execute(value(Type.Character.typeName, 'A'), value(Type.Character.typeName, 'B')) ).to.deep.equal(value(Type.String.typeName, 'AB'));
            });
            it('Jól hajtódik végre az operátor#9', () => {
                expect( o.execute(value(Type.String.typeName, 'hello '), value(Type.String.typeName, 'teszt')) ).to.deep.equal(value(Type.String.typeName, 'hello teszt'));
            });
            it('Jól hajtódik végre az operátor#10', () => {
                expect( o.execute(value(Type.Character.typeName, 'C'), value(Type.String.typeName, 'str')) ).to.deep.equal(value(Type.String.typeName, 'Cstr'));
            });
            it('Jól hajtódik végre az operátor#11', () => {
                expect( o.execute(value(Type.String.typeName, 'Ures:'), value(Type.Character.typeName, ' ')) ).to.deep.equal(value(Type.String.typeName, 'Ures: '));
            });
        });
        describe('-', () => {
            const o = list[2].operators[1];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), variableList.int); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, -1), value(Type.Integer.typeName, Type.Integer.maximum)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( () => { o.execute(value(Type.Integer.typeName, Type.Integer.minimum), value(Type.Integer.typeName, 1)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Integer.typeName, 3)) ).to.deep.equal(value(Type.Integer.typeName, 7));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 10), value(Type.Real.typeName, 3.0)) ).to.deep.equal(value(Type.Real.typeName, 7.0));
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( o.execute(value(Type.Real.typeName, 0.0001), value(Type.Real.typeName, 0.0002)) ).to.deep.equal(value(Type.Real.typeName, -0.0001));
            });
        });
        describe('||', () => {
            const o = list[2].operators[2];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.String.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, false)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Boolean.typeName, true), value(Type.Boolean.typeName, false)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Boolean.typeName, true), value(Type.Boolean.typeName, true)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
        });
    });
    describe('Level 4', () => {
        describe('=', () => {
            const o = list[3].operators[0];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( o.execute(variableList.int, value(Type.Integer.typeName, 123)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(variableList.int, value(Type.Real.typeName, 123)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Character.typeName, 'A'), value(Type.String.typeName, 'A')) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Character.typeName, 'A'), value(Type.Character.typeName, 'a')) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
        });
        describe('<>', () => {
            const o = list[3].operators[1];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( o.execute(variableList.int, value(Type.Integer.typeName, 123)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( o.execute(variableList.int, value(Type.Real.typeName, 123)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Character.typeName, 'A'), value(Type.String.typeName, 'A')) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Character.typeName, 'A'), value(Type.Character.typeName, 'a')) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
        });
        describe('<', () => {
            const o = list[3].operators[2];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.Integer.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Real.typeName, 100.1)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Real.typeName, 0.0), value(Type.Real.typeName, 0.001)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( o.execute(value(Type.String.typeName, 'aaa'), value(Type.String.typeName, 'bbb')) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#9', () => {
                expect( o.execute(value(Type.String.typeName, 'aaa'), value(Type.String.typeName, 'a')) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#10', () => {
                expect( o.execute(value(Type.String.typeName, 'a'), value(Type.String.typeName, 'a')) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#11', () => {
                expect( o.execute(value(Type.Character.typeName, 'a'), value(Type.String.typeName, 'b')) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#12', () => {
                expect( o.execute(value(Type.Character.typeName, 'D'), value(Type.Character.typeName, 'E')) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
        });
        describe('<=', () => {
            const o = list[3].operators[3];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.Integer.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Real.typeName, 100.1)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Real.typeName, 0.0), value(Type.Real.typeName, 0.001)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });

        });
        describe('>', () => {
            const o = list[3].operators[4];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.Integer.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Real.typeName, 100.1)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Real.typeName, 0.0), value(Type.Real.typeName, 0.001)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });

        });
        describe('>=', () => {
            const o = list[3].operators[5];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'bbb'), value(Type.Integer.typeName, 'aaa')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( o.execute(value(Type.Integer.typeName, -100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Real.typeName, 100.1)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(value(Type.Real.typeName, 0.0), value(Type.Real.typeName, 0.001)) ).to.deep.equal(value(Type.Boolean.typeName, false));
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(value(Type.Integer.typeName, 100), value(Type.Integer.typeName, 100)) ).to.deep.equal(value(Type.Boolean.typeName, true));
            });
        });
    });
    describe('Level 5', () => {
        describe('<-', () => {
            const o = list[4].operators[0];
            it('Jól hajtódik végre az operátor#1', () => {
                expect( () => { o.execute(value(Type.String.typeName, 'asd'), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#2', () => {
                expect( () => { o.execute(variableList.int, value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#3', () => {
                expect( () => { o.execute(variableList.bool, value(Type.Character.typeName, 'a')); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#4', () => {
                expect( () => { o.execute(variableList.string, value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#5', () => {
                expect( () => { o.execute(value(Type.Boolean.typeName, false), value(Type.Boolean.typeName, true)); } ) .to.throw(MinorRuntimeError);
            });
            it('Jól hajtódik végre az operátor#6', () => {
                expect( o.execute(variableList.bool, value(Type.Boolean.typeName, false)) ).to.deep.equal(variableList.bool);
                expect( variableList.bool.type ).to.equal(typeRegister.getByName(Type.Boolean.typeName));
                expect( variableList.bool.getValue()).to.equal(false);
            });
            it('Jól hajtódik végre az operátor#7', () => {
                expect( o.execute(variableList.char, value(Type.String.typeName, 'A')) ).to.deep.equal(variableList.char);
                expect( variableList.char.type ).to.equal(typeRegister.getByName(Type.Character.typeName));
                expect( variableList.char.getValue()).to.equal('A');
            });
            it('Jól hajtódik végre az operátor#8', () => {
                expect( o.execute(variableList.string, value(Type.Character.typeName, 'C')) ).to.deep.equal(variableList.string);
                expect( variableList.string.type ).to.equal(typeRegister.getByName(Type.String.typeName));
                expect( variableList.string.getValue()).to.equal('C');
            });
            it('Jól hajtódik végre az operátor#9', () => {
                expect( o.execute(variableList.int, value(Type.Real.typeName, 150.99999)) ).to.deep.equal(variableList.int);
                expect( variableList.int.type ).to.equal(typeRegister.getByName(Type.Integer.typeName));
                expect( variableList.int.getValue()).to.equal(150);
            });
            it('Jól hajtódik végre az operátor#10', () => {
                expect( o.execute(variableList.string, value(Type.String.typeName, 'ez egy string')) ).to.deep.equal(variableList.string);
                expect( variableList.string.type ).to.equal(typeRegister.getByName(Type.String.typeName));
                expect( variableList.string.getValue()).to.equal('ez egy string');
            });
        });
    });
});
