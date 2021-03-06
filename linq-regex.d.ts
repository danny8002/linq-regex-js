declare module "linq-regex" {
    export abstract class ParseErrorData {
        constructor(position: number);
        public position: number;
    }

    export class RegexParseErrorData extends ParseErrorData {
        constructor(position: number, pattern: string, description: string);
        public pattern: string;
        public description: string;
    }

    export class NoParseErrorData extends ParseErrorData {
        constructor();
    }

    export class AggregateParseErrorData extends ParseErrorData {
        constructor(position: number, errors: ParseErrorData[]);
    }

    export class PrematureEndParseErrorData extends ParseErrorData {
        constructor(position: number);
    }

    export class ParseData<T>{
        constructor(error: ParseErrorData);
        constructor(result: T, rest: string);

        public result: T;
        public rest: string;
        public error: ParseErrorData;
        public isValid(): boolean;
    }

    export interface TraceToken {
        success: boolean;
        pattern: string;
        description: string;
        length: string;
        source: string;
    }

    export interface Parser<T> {
        (source: string): ParseData<T>;
    }

    export interface ParserGeneratorContext {
        history: ParseErrorData[];

        /**
         * log the parse process when trace!=null && trace.tokens is an array;
         */
        trace?: {
            ignoreWhitespace?: boolean,
            sourceMaxLength?: number,
            tokens?: TraceToken[]
        }
    }

    export class ParserGenerator {
        constructor(context: ParserGeneratorContext);
        public regex(pattern: string, description?: string): Parser<string>;
        public regex<T>(pattern: string, description: string, map: (token: string) => T): Parser<T>;

        public parseUntil(...values: string[]): Parser<string>;

        
        public endOfFile(): Parser<string>;
        
        public static empty<T>(): Parser<T>;
        public static true(): Parser<boolean>;
        public static false(): Parser<boolean>;
    }

    export namespace Parser {

        function all<T1, R>(p1: Parser<T1>, map: Func.Func1<T1, R>): Parser<R>;
        function all<T1, T2, R>(p1: Parser<T1>, p2: Parser<T2>, map: Func.Func2<T1, T2, R>): Parser<R>;
        function all<T1, T2, T3, R>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>, map: Func.Func3<T1, T2, T3, R>): Parser<R>;
        // ...

        function all<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<[T1, T2]>;
        function all<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<[T1, T2, T3]>;
        // ...

        function all<T>(...parsers: Parser<T>[]): Parser<T[]>;

        function many<T>(p: Parser<T>): Parser<T[]>;
        function many<T, R>(p: Parser<T>, map: (arr: T[]) => R): Parser<R>;

        function any<T1, R>(
            p1: Parser<T1>, map1: Func.Func1<T1, R>): Parser<R>;

        function any<T1, T2, R>(
            p1: Parser<T1>, map1: Func.Func1<T1, R>,
            p2: Parser<T2>, map2: Func.Func1<T2, R>): Parser<R>;

        function any<T1, T2, T3, R>(
            p1: Parser<T1>, map1: Func.Func1<T1, R>,
            p2: Parser<T2>, map2: Func.Func1<T2, R>,
            p3: Parser<T3>, map3: Func.Func1<T3, R>): Parser<R>;

        function any<T>(...parsers: Parser<T>[]): Parser<T>;

        function oneOrMore<T>(p: Parser<T>): Parser<T[]>;
        function oneOrMore<T, R>(p: Parser<T>, map: (arr: T[]) => R): Parser<R>;

        function optional<T>(p: Parser<T>, defaultValue: T): Parser<T>;
    }

    export namespace Func {
        export interface Func1<T1, R> {
            (t1: T1): R;
        }

        export interface Func2<T1, T2, R> {
            (t1: T1, t2: T2): R;
        }

        export interface Func3<T1, T2, T3, R> {
            (t1: T1, t2: T2, t3: T3): R;
        }

        export interface Func4<T1, T2, T3, T4, R> {
            (t1: T1, t2: T2, t3: T3, t4: T4): R;
        }

        export interface Func5<T1, T2, T3, T4, T5, R> {
            (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
        }

        export interface Func6<T1, T2, T3, T4, T5, T6, R> {
            (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): R;
        }

        export interface Func7<T1, T2, T3, T4, T6, T5, T7, R> {
            (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): R;
        }
    }

}