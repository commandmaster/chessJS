let gameBoard;

const sketch = function(p5) {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();

    gameBoard = new ChessBoard(p5);
    
  }


  p5.draw = () => {
    p5.noStroke();
    p5.background(255);
    
    gameBoard.Update();
  }


}


class ChessBoard{
  constructor(p5){
    this.p5 = p5;
    this.board = [];
    this.boardSize = 8;
    this.squareSize = 80;

    this.turn = 'white';


    this.pieceColors = {
      pawn: 'red',
      rook: 'blue',
      knight: 'green',
      bishop: 'yellow',
      queen: 'purple',
      king: 'orange'
    }

    this.#createBoard();

  }

  #createBoard(){
    let toggle = true;
    for (let i = 0; i < this.boardSize; i++){
      toggle = !toggle;
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++){
        this.board[i].push(toggle ? 0 : 1);
        toggle = !toggle;
      }
      
    }
  }


  #drawBoard(){
    this.p5.push();
    this.p5.translate(this.p5.width / 2 - this.boardSize * this.squareSize / 2, this.p5.height / 2 - this.boardSize * this.squareSize / 2);

    for (let i = 0; i < this.boardSize; i++){
      for (let j = 0; j < this.boardSize; j++){
        this.p5.fill(this.board[i][j] === 1 ? 255 : 0);
        this.p5.rect(i * this.squareSize, j * this.squareSize, this.squareSize, this.squareSize);
      }
    }

    this.p5.pop();
  }

  Update(){
    this.#drawBoard();
  }
}


class GameGrid{
  constructor(){
    this.grid = [];
    this.size = 8;
    
    this.pieceTypes = {
      empty: 0,
      pawn: 1,
      rook: 2,
      knight: 3,
      bishop: 4,
      queen: 5,
      king: 6
    }

    this.#populateGrid();
  }

  #populateGrid(){
    const e = this.pieceTypes.empty;
    const p = this.pieceTypes.pawn;
    const r = this.pieceTypes.rook;
    const k = this.pieceTypes.knight;
    const b = this.pieceTypes.bishop;
    const q = this.pieceTypes.queen;
    const K = this.pieceTypes.king;

    this.grid = [
      [r, k, b, q, K, b, k, r],
      [p, p, p, p, p, p, p, p],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [p, p, p, p, p, p, p, p],
      [r, k, b, q, K, b, k, r]
    ];
  }

}







class Rules{
  static rules = [...PieceRules.rules, ...GameRules.rules]

  static pieceTypes = {
    empty: 0,
    pawn: 1,
    rook: 2,
    knight: 3,
    bishop: 4,
    queen: 5,
    king: 6
  }

  static MakeMove(piece, startX, startY, endX, endY){
    if (piece === 0){
      
    }
    
  }

  



}

class PieceRules{
  static pawnRules = [PawnRules.PawnMove, PawnRules.PawnCapture, PawnRules.PawnPromote, PawnRules.PawnEnPassant, PawnRules.PawnDoubleMove]
  static rookRules = [RookRules.RookMove, RookRules.RookCapture, RookRules.RookCastle]
  static knightRules = [KnightRules.KnightMove, KnightRules.KnightCapture]
  static bishopRules = [BishopRules.BishopMove, BishopRules.BishopCapture]
  static queenRules = [QueenRules.QueenMove, QueenRules.QueenCapture]
  static kingRules = [KingRules.KingMove, KingRules.KingCapture, KingRules.KingCastle]

  static rules = [...this.pawnRules, ...this.rookRules, ...this.knightRules, ...this.bishopRules, ...this.queenRules, ...this.kingRules]

}

class GameRules{
  static rules = [this.Check, this.Checkmate, this.Stalemate, this.Draw, this.Resign]
  static Check(){

  }

  static Checkmate(){

  }

  static Stalemate(){

  }

  static Draw(){

  }

  static Resign(){

  }
}

class PawnRules{
  static PawnMove(){

  }

  static PawnCapture(){

  }

  static PawnPromote(){
  
  }

  static PawnEnPassant(){

  }

  static PawnDoubleMove(){
  
  }
}

class RookRules{
  static RookMove(){
    
  }

  static RookCapture(){

  }

  static RookCastle(){

  }
}

class KnightRules{
  static KnightMove(){

  }

  static KnightCapture(){

  }
}

class BishopRules{
  static BishopMove(){

  }

  static BishopCapture(){

  }
}

class QueenRules{
  static QueenMove(){

  }

  static QueenCapture(){

  }
}

class KingRules{
  static KingMove(){

  }

  static KingCapture(){

  }

  static KingCastle(){

  }
}







class GpuAccelleration{
  constructor(p5){
    this.p5 = p5;
    this.gpu = new GPU.GPU();

  }

  Update(){
    this.p5.push();
    this.p5.pop();
  }
}




window.addEventListener('load', () => {
  let gameWindowSketch = new p5(sketch);
});

































const gpu = new GPU.GPU();

const generateGameGrid = (width, height) => {
  const grid = [];
  for (let i = 0; i < height; i++){
    grid.push([]);
    for (let j = 0; j < width; j++){
      grid[i].push(Math.floor(Math.random() * 2));
    }
  }

  return grid;
}



function newGeneration(grid, width, height){
  const gameOfLife = gpu.createKernel(function(grid, width, height) {
    const x = this.thread.x;
    const y = this.thread.y;
    let numNeighbors = 0;
  
    for (let i = -1; i < 2; i++){
      for (let j = -1; j < 2; j++){

  
        const neighborX = x + i;
        const neighborY = y + j;
        
        if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height){
          numNeighbors += grid[neighborY][neighborX];
        }
  
      }
    }
  
  
    if (grid[y][x] === 1){
      numNeighbors -= 1;
      if (numNeighbors < 2 || numNeighbors > 3){
        return 0;
      }
  
      return 1;
    }
  
    else{
      if (numNeighbors === 3){
        return 1;
      }
  
      return 0;
    }


    
  }).setOutput([width, height]);
  

  return gameOfLife(grid, width, height);
}




  let oldGrid = generateGameGrid(1000, 1000);

  let loopProgress = [0, 0]

  let timeout;

  let gpuSketch = function(p5){
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.noStroke();
      
      p5.background(255);
    }

    p5.draw = () => {
      console.log(p5.frameRate());


      const generationsPerFrame = 1;
      let newGrid;

      for (let i = 0; i < generationsPerFrame; i++){
        try{
          newGrid = newGeneration(oldGrid, oldGrid[0].length, oldGrid.length);
          oldGrid = newGrid;
        }

        catch(e){
          newGrid = oldGrid;
          console.log(e);
        }
        
      }
       
      


    
      const start = performance.now();

      

      

      for (let i = loopProgress[0]; i < newGrid.length; i++){
        for (let j = loopProgress[1]; j < newGrid[i].length; j++){
          const size = 1;
          

          if (performance.now() - start > 1000/60){
            loopProgress = [i, j];
            return;
          }

          p5.fill(newGrid[i][j] === 1 ? 0 : 255);
          p5.rect(i * size, j * size, size, size);
          

          
        }

        loopProgress[1] = 0;
    
      }

      loopProgress = [0, 0];

      

     
      
      
      
    }
  }

  // let gpuSketchInstance = new p5(gpuSketch);
  