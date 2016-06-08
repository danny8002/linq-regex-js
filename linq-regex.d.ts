declare module "linq-regex" {
    export abstract class ParserErrorData {
        constructor(position: number);
        public position: number;
    }

    export class RegexParseErrorData extends ParserErrorData {
        constructor(position: number, pattern: string, description: string);
        public pattern: string;
        public description: string;
    }

    export class ParseData<T>{
        constructor(error: ParserErrorData);
        constructor(result: T, rest: string);

        public isValid(): boolean;
    }

}