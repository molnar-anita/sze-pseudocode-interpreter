/** A Subrutin osztály reprezentálja a felhasználó álltal meghatározott függvényeket és eljárásokat melyeket a kódból is meg lehet hívni **/
import {ControlFlowBuilder} from '../ControlFlow/ControlFlowBuilder';
import {Part} from '../ControlFlow/Structures';
import {ExpressionBuilder} from '../Expression';
import * as Lexer from '../Lexer/index';

export class Subrutin {
    private part: Part;
    constructor(rows: Lexer.IRow[][], private controlFlowBuilder: ControlFlowBuilder, private expressionBuilder: ExpressionBuilder) {
        this.part = new Part(this.controlFlowBuilder, this.expressionBuilder, rows);
    }
    public async execute(): Promise<any> {
        await this.part.execute();
    }
}
