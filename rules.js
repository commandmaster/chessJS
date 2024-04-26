class PieceTypes{
    static types = {
        empty: 0,
        white_pawn: 1,
        white_rook: 2,
        white_knight: 3,
        white_bishop: 4,
        white_queen: 5,
        white_king: 6,
        black_pawn: 7,
        black_rook: 8,
        black_knight: 9,
        black_bishop: 10,
        black_queen: 11,
        black_king: 12
    }
}


class GeneralRules{
    static Check(side, board, startX, startY, endX, endY){
        const newBoard = JSON.parse(JSON.stringify(board));
        

        newBoard[endX][endY] = newBoard[startX][startY];

        newBoard[startX][startY] = PieceTypes.types.empty;

        //find the king
        let kingX = -1;
        let kingY = -1;

        const kingConstant = side === "white" ? PieceTypes.types.white_king : PieceTypes.types.black_king;        
        for (let i = 0; i < newBoard.length; i++){
            for (let j = 0; j < newBoard[i].length; j++){
                if (newBoard[i][j] === kingConstant){
                    kingX = i;
                    kingY = j;
                }
            }
        }

        console.log(kingX, kingY);

        

        //check all opposite color pieces to see if they can see the kind
        for (let i = 0; i < newBoard.length; i++){
            for (let j = 0; j < newBoard[i].length; j++){
                const pawnConstant = side === "black" ? PieceTypes.types.white_pawn : PieceTypes.types.black_pawn;
                const rookConstant = side === "black" ? PieceTypes.types.white_rook : PieceTypes.types.black_rook;
                const knightConstant = side === "black" ? PieceTypes.types.white_knight : PieceTypes.types.black_knight;
                const bishopConstant = side === "black" ? PieceTypes.types.white_bishop : PieceTypes.types.black_bishop;
                const queenConstant = side === "black" ? PieceTypes.types.white_queen : PieceTypes.types.black_queen;
                const kingConstant = side === "black" ? PieceTypes.types.white_king : PieceTypes.types.black_king;

         
                if (newBoard[i][j] === pawnConstant){
                    
                    if (PieceRules.MovePawn(newBoard, i, j, kingX, kingY)) {
                        console.log('attacked by pawn')
                        return true;
                    }
                }

                if (newBoard[i][j] === rookConstant){
                    if (PieceRules.MoveRook(newBoard, i, j, kingX, kingY)) {
                        console.log('attacked by rook')
                        return true;
                    }
                }

                if (newBoard[i][j] === knightConstant){
                    if (PieceRules.MoveKnight(newBoard, i, j, kingX, kingY)) {
                        console.log('attacked by knight')
                        return true;
                    }
                }

                if (newBoard[i][j] === bishopConstant){
                    if (PieceRules.MoveBishop(newBoard, i, j, kingX, kingY)) {
                        console.log('attacked by bishop')
                        return true;
                    }
                }

                if (newBoard[i][j] === queenConstant){
                    if (PieceRules.MoveQueen(newBoard, i, j, kingX, kingY)) {
                        console.log(i, j, kingX, kingY)
                        console.log('attacked by queen')
                        return true;
                    }
                }

                if (newBoard[i][j] === kingConstant){
                    if (PieceRules.MoveKing(newBoard, i, j, kingX, kingY)) {
                        console.log('attacked by king')
                        return true;
                    }
                }
            }
        }

        console.log('no check')
        return false;
       
    }
}

class PieceRules{
    static pieceTypes = PieceTypes.types;

    static capturesOwnPiece(board, startX, startY, endX, endY){
        if (board[startX][startY] === this.pieceTypes.empty) return false;
        if (board[endX][endY] === this.pieceTypes.empty) return false;

        return board[startX][startY] < 7 ? board[endX][endY] < 7 : board[endX][endY] > 6;
    }

    static MovePawn(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (board[startX][startY] === this.pieceTypes.white_pawn){
            if (startX === 6 && endX === 4 && startY === endY && board[4][startY] === this.pieceTypes.empty){
                return true;
            }

            if (startX - 1 === endX && startY === endY && board[endX][endY] === this.pieceTypes.empty){
                return true;
            }

            if (startX - 1 === endX && (startY - 1 === endY || startY + 1 === endY) && board[endX][endY] !== this.pieceTypes.empty){
                return true;
            }

            return false;
        }

        else if (board[startX][startY] === this.pieceTypes.black_pawn){
            if (startX === 1 && endX === 3 && startY === endY && board[3][startY] === this.pieceTypes.empty){
                return true;
            }

            if (startX + 1 === endX && startY === endY && board[endX][endY] === this.pieceTypes.empty){
                return true;
            }

            if (startX + 1 === endX && (startY - 1 === endY || startY + 1 === endY) && board[endX][endY] !== this.pieceTypes.empty){
                return true;
            }

            return false;
        }
    }

    static MoveRook(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (startX === endX) {
            if (startY < endY) {
                for (let i = startY + 1; i < endY; i++) {
                    if (board[startX][i] !== this.pieceTypes.empty) {
                        return false;
                    }
                }
            } else {
                for (let i = startY - 1; i > endY; i--) {
                    if (board[startX][i] !== this.pieceTypes.empty) {
                        return false;
                    }
                }
            }
            return true;
        } else if (startY === endY) {
            if (startX < endX) {
                for (let i = startX + 1; i < endX; i++) {
                    if (board[i][startY] !== this.pieceTypes.empty) {
                        return false;
                    }
                }
            } else {
                for (let i = startX - 1; i > endX; i--) {
                    if (board[i][startY] !== this.pieceTypes.empty) {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }

    static MoveKnight(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (startX - 2 === endX && startY - 1 === endY) return true;
        if (startX - 2 === endX && startY + 1 === endY) return true;
        if (startX + 2 === endX && startY - 1 === endY) return true;
        if (startX + 2 === endX && startY + 1 === endY) return true;
        if (startX - 1 === endX && startY - 2 === endY) return true;
        if (startX - 1 === endX && startY + 2 === endY) return true;
        if (startX + 1 === endX && startY - 2 === endY) return true;
        if (startX + 1 === endX && startY + 2 === endY) return true;

        return false;
    }

    static MoveBishop(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (Math.abs(startX - endX) !== Math.abs(startY - endY)) return false;

        if (startX < endX && startY < endY){
            for (let i = 1; i < Math.abs(startX - endX); i++){
                if (board[startX + i][startY + i] !== this.pieceTypes.empty) return false;
            }
        } else if (startX < endX && startY > endY){
            for (let i = 1; i < Math.abs(startX - endX); i++){
                if (board[startX + i][startY - i] !== this.pieceTypes.empty) return false;
            }
        } else if (startX > endX && startY < endY){
            for (let i = 1; i < Math.abs(startX - endX); i++){
                if (board[startX - i][startY + i] !== this.pieceTypes.empty) return false;
            }
        } else if (startX > endX && startY > endY){
            for (let i = 1; i < Math.abs(startX - endX); i++){
                if (board[startX - i][startY - i] !== this.pieceTypes.empty) return false;
            }
        }

        return true;
    }

    static MoveQueen(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (this.MoveRook(board, startX, startY, endX, endY)) return true;
        if (this.MoveBishop(board, startX, startY, endX, endY)) return true;

        return false;
    }

    static MoveKing(board, startX, startY, endX, endY){
        if (PieceRules.capturesOwnPiece(board, startX, startY, endX, endY)) return false;

        if (Math.abs(startX - endX) <= 1 && Math.abs(startY - endY) <= 1) return true;

        return false;
    }
}






class Action{
    static pieceTypes = PieceTypes.types;

    static MovePawn = PieceRules.MovePawn;
    static MoveRook = PieceRules.MoveRook;
    static MoveKnight = PieceRules.MoveKnight;
    static MoveBishop = PieceRules.MoveBishop;
    static MoveQueen = PieceRules.MoveQueen;
    static MoveKing = PieceRules.MoveKing;

    static Check = GeneralRules.Check;

    static MovePiece(piece, board, startX, startY, endX, endY){
        if (piece === this.pieceTypes.empty) return board; 
        if (startX < 0 || startX >= board.length || startY < 0 || startY >= board[0].length) return board;
        if (endX < 0 || endX >= board.length || endY < 0 || endY >= board[0].length) return board;
        
        
        if (board[startX][startY] !== piece) return board;
        if (this.Check(piece < 7 ? "white" : "black", board, startX, startY, endX, endY)) return board;


        // check if action is castling or moving a piece
        if (piece === this.pieceTypes.white_king){
            if (startX === 7 && startY === 4 && endX === 7 && endY === 0){
                return this.Castle(board, "white", "short");
            } else if (startX === 7 && startY === 4 && endX === 7 && endY === 7){
                return this.Castle(board, "white", "long");
            }
        }

        if (piece === this.pieceTypes.black_king){
            if (startX === 0 && startY === 4 && endX === 0 && endY === 6){
                return this.Castle(board, "black", "short");
            } else if (startX === 0 && startY === 4 && endX === 0 && endY === 2){
                return this.Castle(board, "black", "long");
            }
        }

        
        
        
        switch(piece){
            case this.pieceTypes.white_pawn:
                if (this.MovePawn(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.black_pawn:
                if (this.MovePawn(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.white_rook:
                if (this.MoveRook(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.black_rook:
                if (this.MoveRook(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.white_knight:
                if (this.MoveKnight(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.black_knight:
                if (this.MoveKnight(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.white_bishop:
                if (this.MoveBishop(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            
            case this.pieceTypes.black_bishop:
                if (this.MoveBishop(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;

            case this.pieceTypes.white_queen:
                if (this.MoveQueen(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            
            case this.pieceTypes.black_queen:
                if (this.MoveQueen(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            
            case this.pieceTypes.white_king:
                if (this.MoveKing(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            
            case this.pieceTypes.black_king:
                if (this.MoveKing(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            
            default:
                return board;
        }
    }

    static Castle(board, side, type){
        // check square empty

        if (side === "white"){
            if (type == "short"){
                if (board[7][7] !== this.pieceTypes.white_rook) return board;
                if (board[7][5] !== this.pieceTypes.empty) return board;
                if (board[7][6] !== this.pieceTypes.empty) return board;
                if (board[7][4] !== this.pieceTypes.white_king) return board;

                board[7][5] = this.pieceTypes.white_rook;
                board[7][6] = this.pieceTypes.white_king;
                board[7][7] = this.pieceTypes.empty;
                board[7][4] = this.pieceTypes.empty;

                return board;
            } else if (type == "long"){
                if (board[7][0] !== this.pieceTypes.white_rook) return board;
                if (board[7][1] !== this.pieceTypes.empty) return board;
                if (board[7][2] !== this.pieceTypes.empty) return board;
                if (board[7][3] !== this.pieceTypes.empty) return board;
                if (board[7][4] !== this.pieceTypes.white_king) return board;

                board[7][3] = this.pieceTypes.white_rook;
                board[7][2] = this.pieceTypes.white_king;
                board[7][0] = this.pieceTypes.empty;
                board[7][4] = this.pieceTypes.empty;

                return board;
            }
        }

        if (side === "black"){
            if (type == "short"){
                if (board[0][7] !== this.pieceTypes.black_rook) return board;
                if (board[0][5] !== this.pieceTypes.empty) return board;
                if (board[0][6] !== this.pieceTypes.empty) return board;
                if (board[0][4] !== this.pieceTypes.black_king) return board;

                board[0][5] = this.pieceTypes.black_rook;
                board[0][6] = this.pieceTypes.black_king;
                board[0][7] = this.pieceTypes.empty;
                board[0][4] = this.pieceTypes.empty;

                return board;   
            } else if (type == "long"){
                if (board[0][0] !== this.pieceTypes.black_rook) return board;
                if (board[0][1] !== this.pieceTypes.empty) return board;
                if (board[0][2] !== this.pieceTypes.empty) return board;
                if (board[0][3] !== this.pieceTypes.empty) return board;
                if (board[0][4] !== this.pieceTypes.black_king) return board;

                board[0][3] = this.pieceTypes.black_rook;
                board[0][2] = this.pieceTypes.black_king;
                board[0][0] = this.pieceTypes.empty;
                board[0][4] = this.pieceTypes.empty;

                return board;
            }
        }

    }

    static Resign(board, side){
        
    }

    static RequestDraw(){

    }
}
  
