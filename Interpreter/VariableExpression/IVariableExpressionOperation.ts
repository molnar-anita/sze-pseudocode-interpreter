
export interface IVariableExpressionOperation {
    name: string;
    execute(element: any): Promise<any>;
}
