class Token {
    constructor() {
        this.tokensQueue = [];
    }

    //在某一个位置插入token
    inseartToken(token, pos) {
        // this.tokensQueue.splice(1, 0, token);
        // const offsetLength = token.content
        // for(let j = 0 ; )
        
    }

    createToken(leftPos, rightPos, mark, content) {
        return {leftPos, rightPos, mark, content};
    }

}