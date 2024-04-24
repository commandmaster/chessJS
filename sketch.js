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
    
    this.pieceTypes = PieceTypes.types;

    this.#populateGrid();
  }

  #populateGrid(){
    const ee = this.pieceTypes.empty;

    const wp = this.pieceTypes.white_pawn;
    const wr = this.pieceTypes.white_rook;
    const wk = this.pieceTypes.white_knight;
    const wb = this.pieceTypes.white_bishop;
    const wq = this.pieceTypes.white_queen;
    const wK = this.pieceTypes.white_king;

    const bp = this.pieceTypes.black_pawn;
    const br = this.pieceTypes.black_rook;
    const bk = this.pieceTypes.black_knight;
    const bb = this.pieceTypes.black_bishop;
    const bq = this.pieceTypes.black_queen;
    const bK = this.pieceTypes.black_king;

    

    this.grid = [
      [br, bk, bb, bq, bK, bb, bk, br],
      [bp, bp, bp, bp, bp, bp, bp, bp],
      [ee, ee, ee, ee, ee, ee, ee, ee],
      [ee, ee, ee, ee, ee, ee, ee, ee],
      [ee, ee, ee, ee, ee, ee, ee, ee],
      [ee, ee, ee, ee, ee, ee, ee, ee],
      [wp, wp, wp, wp, wp, wp, wp, wp],
      [wr, wk, wb, wq, wK, wb, wk, wr]
    ];
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




// window.addEventListener('load', () => {
//   let gameWindowSketch = new p5(sketch);
// });

































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




  let oldGrid = generateGameGrid(100, 100);

  let loopProgress = [0, 0]

  let timeout;

  let gpuSketch = function(p5){
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.noStroke();
      
      p5.background(255);
      p5.frameRate(10)
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
          const size = 5;
          

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

  let gpuSketchInstance = new p5(gpuSketch);
  