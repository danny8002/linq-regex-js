/**ParserErrorData
 * @class 
 */
class ParserErrorData{
    private position:number;
    /**
 * 
 * @constructor
 * @param {number} position where parser fails
 */
    constructor(position:number){
        this.position=position;
    }

/**
 * my method
 */
    public setMyV():void{

    }
}

 class RegexParseErrorData extends ParserErrorData{
     private pattern:string;
    constructor(position: number, pattern:string, description:string):base(position){
        this.pattern = pattern;
    }
}