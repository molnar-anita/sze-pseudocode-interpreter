import {MinorInterpreterError} from '../Error';
import {IType} from './IType';
import {isSimpleType, SimpleType} from './SimpleType';

export class TypeRegister {
        private moduleName: string = 'Típus regisztrátor';
        private readonly simpleTypes: SimpleType[];
        public constructor(private readonly types: IType[]) {
            this.simpleTypes = new Array<SimpleType>();
            for (const type of types) {
                if (isSimpleType(type)) {
                    this.simpleTypes.push(type);
                }
            }
        }

        public addTypes(types: IType[]) {
            this.types.push(...types);
            for (const type of types) {
                if (isSimpleType(type)) {
                    this.simpleTypes.push(type);
                }
            }
        }

        public getByName(name: string): IType {
            const founded: IType = this.types.find((type) => type.name === name);
            if (typeof founded === 'undefined') {
                throw new MinorInterpreterError(this.moduleName, 'Ilyen típus nem létezik (' + name + ')');
            }
            return founded;
        }

        public getAllAsArray(): IType[] {
            return this.types;
        }

        public getByNames(names: string[]): IType[] {
            const foundedTypes: IType[] = new Array(names.length);
            for (const i in names) {
                foundedTypes[i] = this.getByName(names[i]);
            }
            return foundedTypes;
        }

        public getAllSimpleTypeAsArray(): SimpleType[] {
            return this.simpleTypes;
        }

        public getSimpleTypeByName(name: string): SimpleType {
            const founded: SimpleType = this.simpleTypes.find((type) => type.name === name);
            if (typeof founded === 'undefined') {
                throw new MinorInterpreterError(this.moduleName, 'Ilyen típus nem létezik (' + name + ')');
            }
            return founded;
        }

        public getSimpleTypesByNames(names: string[]): SimpleType[] {
            const foundedTypes: SimpleType[] = new Array(names.length);
            for (const i in names) {
                foundedTypes[i] = this.getSimpleTypeByName(names[i]);
            }
            return foundedTypes;
        }
}
