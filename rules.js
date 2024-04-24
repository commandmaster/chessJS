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


class Action{
    static pieceTypes = PieceTypes.types;

    static MovePiece(piece, board, startX, startY, endX, endY){
        if (piece === this.pieceTypes.empty) return board;
        if (startX < 0 || startX >= board.length || startY < 0 || startY >= board[0].length) return board;
        if (endX < 0 || endX >= board.length || endY < 0 || endY >= board[0].length) return board;
        if (board[startX][startY] !== piece) return board;

        switch(piece){
            case this.pieceTypes.pawn:
                return this.MovePawn(board, startX, startY, endX, endY);
            case this.pieceTypes.rook:
                return this.MoveRook(board, startX, startY, endX, endY);
            case this.pieceTypes.knight:
                return this.MoveKnight(board, startX, startY, endX, endY);
            case this.pieceTypes.bishop:
                return this.MoveBishop(board, startX, startY, endX, endY);
            case this.pieceTypes.queen:
                return this.MoveQueen(board, startX, startY, endX, endY);
            case this.pieceTypes.king:
                return this.MoveKing(board, startX, startY, endX, endY);
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
  

class GeneralRules{
    
    static Check(side, board){
        let kingX = -1;
        let kingY = -1;

        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++){
                if (board[i][j] === this.pieceTypes.king){
                    kingX = i;
                    kingY = j;
                    break;
                }
            }
        }

        if (kingX === -1 || kingY === -1){
            console.log("King not found");
            throw new Error("King not found");
            //return false;
        } 

        // check enemie pieces if they can see a square

        return false;
    }
}

class PieceRules{
    static MovePawn(board, startX, startY, endX, endY){

    }

    static MoveRook(board, startX, startY, endX, endY){

    }

    static MoveKnight(board, startX, startY, endX, endY){

    }

    static MoveBishop(board, startX, startY, endX, endY){

    }

    static MoveQueen(board, startX, startY, endX, endY){

    }

    static MoveKing(board, startX, startY, endX, endY){

    }
}



