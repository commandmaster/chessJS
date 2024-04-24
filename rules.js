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
                if (this.MovePawn(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            case this.pieceTypes.rook:
                if (this.MoveRook(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            case this.pieceTypes.knight:
                if (this.MoveKnight(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            case this.pieceTypes.bishop:
                if (this.MoveBishop(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            case this.pieceTypes.queen:
                if (this.MoveQueen(board, startX, startY, endX, endY)){
                    board[endX][endY] = board[startX][startY];
                    board[startX][startY] = this.pieceTypes.empty;
                }

                return board;
            case this.pieceTypes.king:
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
        let enemySide = side === "white" ? "black" : "white";
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++){
                if (board[i][j] === this.pieceTypes.empty) continue;
                if (board[i][j] === this.pieceTypes.king) continue;
                if (board[i][j] === this.pieceTypes.pawn) continue;

                let piece = board[i][j];
                let canMove = Action.MovePiece(piece, board, i, j, kingX, kingY);
                if (canMove !== board) return true;
            }
        }

        return false;
    }
}

class PieceRules{
    static MovePawn(board, startX, startY, endX, endY){
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

        if (board[startX][startY] === this.pieceTypes.black_pawn){
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
        if (this.MoveRook(board, startX, startY, endX, endY)) return true;
        if (this.MoveBishop(board, startX, startY, endX, endY)) return true;

        return false;
    }

    static MoveKing(board, startX, startY, endX, endY){
        if (Math.abs(startX - endX) <= 1 && Math.abs(startY - endY) <= 1) return true;

        return false;
    }
}



