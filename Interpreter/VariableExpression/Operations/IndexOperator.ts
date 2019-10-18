import {MinorInterpreterError, MinorRuntimeError} from '../../Error';
import {Expression, ExpressionBuilder} from '../../Expression';
import {Lexer} from '../../Lexer';
import {Integer, isRecordType, String, TypeRegister} from '../../Type';
import {IGettable, isGettable, isSettable, Value} from '../../Variable';
import {isMyArray, MyArray} from '../../Variable/MyArray';
import {ArrayElement} from '../ArrayElement';
import {IVariableExpressionOperation} from '../IVariableExpressionOperation';
import {StringElement} from '../StringElement';

export class IndexOperator implements IVariableExpressionOperation {
    public readonly name: string = 'Index';
    public readonly indexOperator = true;

    private firstExpressions: Expression;
    private secondExpressions?: Expression;

    constructor(array: any[], private expressionBuilder: ExpressionBuilder, private typeRegister: TypeRegister) {
        if (array[0] !== '[' || array[array.length - 1] !== ']' ) {
            throw new MinorInterpreterError(this.name, 'A tömb indexének szögletes zárójelek között kell szerepelnie!');
        } else if (array.length === 2) {
            throw new MinorInterpreterError(this.name, 'A szögletes zárojelek között meg kell adni a tömb indexét!');
        }
        array.pop();
        array.shift();
        const subArrays = Lexer.splitByCommas(array);
        if (subArrays.length > 2) {
            throw new MinorInterpreterError(this.name, 'Maximálisan csak két dimenziós indexre van lehetőség lekérdezni!');
        }

        this.firstExpressions = this.expressionBuilder.build(subArrays[0]);
        if (subArrays.length === 2) {
            this.secondExpressions = this.expressionBuilder.build(subArrays[1]);
        }
    }

    public async execute(element: any): Promise<any> {
        if (isGettable(element) && isSettable(element) && (element.type.name === String.typeName)) {
            if (this.secondExpressions) {
                throw new MinorRuntimeError(this.name, 'Szövegnek csak egy dimenziója van!');
            }
            const firstResult = await this.firstExpressions.execute();
            if (!isGettable(firstResult) || firstResult.type.name !== Integer.typeName) {
                throw new MinorRuntimeError(this.name, 'Az első indexének egész típusúnak kell lennie!');
            }
            const str = element.getValue();
            const index = (firstResult as IGettable).getValue();
            if (index < 1 || index > str.length) {
                throw new MinorRuntimeError(this.name, 'A szövegen kívülre mutat az index!');
            }
            return new StringElement(element, index - 1, this.typeRegister);
        }

        if (!isMyArray(element)) {
            throw new MinorRuntimeError(this.name, 'Csak tömbnek és szöveg típusú változónak lehet valahányadik elemét venni');
        }
        const array = (element as MyArray);
        const firstResult = await this.firstExpressions.execute();
        if (!isGettable(firstResult) || firstResult.type.name !== Integer.typeName) {
            throw new MinorRuntimeError(this.name, 'A tömb első indexének egész típusúnak kell lennie!');
        }
        if (this.secondExpressions) {
            const secondResult = await this.secondExpressions.execute();
            if (!isGettable(secondResult) || secondResult.type.name !== Integer.typeName) {
                throw new MinorRuntimeError(this.name, 'A tömb második indexének egész típusúnak kell lennie!');
            }
            if ( isRecordType(array.type)) {
                const firstIndex = (firstResult as IGettable).getValue();
                const secondIndex = (secondResult as IGettable).getValue();
                if (!array.isIndexInside(firstIndex, secondIndex)) {
                    throw new MinorRuntimeError(this.name, 'Az index(ek) a tömbön kívülre mutatnak!');
                }
                return array.getValueByIndex(firstIndex, secondIndex);
            }
            return new ArrayElement(array, array.type, (firstResult as IGettable).getValue(), (secondResult as IGettable).getValue());
        }
        if ( isRecordType(array.type)) {
            const firstIndex = (firstResult as IGettable).getValue();
            if (!array.isIndexInside(firstIndex)) {
                throw new MinorRuntimeError(this.name, 'Az index(ek) a tömbön kívülre mutatnak!');
            }
            return array.getValueByIndex(firstIndex);
        }
        return new ArrayElement(array, array.type, (firstResult as IGettable).getValue());
    }
}

export function isIndexOperator(it: any): it is IndexOperator {
    return (it as IndexOperator).indexOperator !== undefined;
}
