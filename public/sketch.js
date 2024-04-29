let gameBoard;
let p5Camera;

let uiHandler = new UIHandler();



const localSketch = function(p){
  p.preload = () => {
    gameBoard = new ChessBoard(p);
  }

  p.setup = () => {
    
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();


    p5Camera = new P5Camera(p, {x: 0, y: 0}, gameBoard.squareSize * gameBoard.boardSize / 2, gameBoard.squareSize * gameBoard.boardSize / 2, 1, 0);
    p5Camera.ShouldResizeWindow(true);
    
  }


  p.draw = () => {
    p.noStroke();
    p.background(255);
    
  
    p5Camera.LoopStart();
    p5Camera.ZoomToFit(gameBoard.squareSize * gameBoard.boardSize, gameBoard.squareSize * gameBoard.boardSize, 0);
  
    gameBoard.Update();
    
    p5Camera.LoopEnd();
  
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }


}

const loadingSketch = function(p) {
  p.setup = () => {
    
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();


    function sineWaveAnimation(uiElement, height, speed){
      uiElement.addCustomBehavior((uiElement) => {
        uiElement.y = uiElement.elementOptions.y + Math.sin(p.frameCount / (1/speed)) * height - height;
      });
    }


    uiHandler.AddWidget('loadScreen', new UIWidget(p));
    
    const pixelFont = new UIFont(p, 'fonts/pixelFont.otf');


    const chessText = new UIText(p, uiHandler.Get('loadScreen'), {x: 0, y: -450, anchor: 'center', text:'Chess', textSize: 70, placeMode: 'center', font: pixelFont});
    sineWaveAnimation(chessText, 15, 0.035);

    const localTxt = new UIText(p, uiHandler.Get('loadScreen'), {x: -130, y: -155, anchor: 'center', text:'Local 2 Player', textSize: 40, placeMode: 'center', font: pixelFont});
    const localButton = new UIButton(p, uiHandler.Get('loadScreen'), {x: 130, y: -150, width: 50, height: 50, anchor: 'center', placeMode: 'center'});
    sineWaveAnimation(localTxt, 8, 0.035);
    sineWaveAnimation(localButton, 8, 0.035);
    

    const multiplayerTxt = new UIText(p, uiHandler.Get('loadScreen'), {x: -130, y: -55, anchor: 'center', text:'Multiplayer', textSize: 40, placeMode: 'center', font: pixelFont});
    const multiplayerButton = new UIButton(p, uiHandler.Get('loadScreen'), {x: 130, y: -50, width: 50, height: 50, anchor: 'center', placeMode: 'center'});
    sineWaveAnimation(multiplayerTxt, 8, 0.035);
    sineWaveAnimation(multiplayerButton, 8, 0.035);


    localButton.onClick = () => {
      uiHandler.HideAllWidgets();

      gameWindowSketch = new p5(localSketch);
      p.remove();
      
    }

    multiplayerButton.onClick = () => {
      uiHandler.HideAllWidgets();

      gameWindowSketch = new p5(MultiplayerSketch);
      p.remove();
    }


    uiHandler.SetActiveWidget('loadScreen');
  }


  p.draw = () => {
    p.noStroke();
    p.background(255);
    
  
    uiHandler.Update();

   

  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }


}


let networkManager;
let chatWindow;

let mpChessBoard;

const MultiplayerSketch = function(p){
  p.preload = () => {
    networkManager = new NetworkManager(p);
    mpChessBoard = new MPChessBoard(p);
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();

    const windowX = p.windowWidth - 300;
    const windowY = 30;
    chatWindow = new ChatBox(p, windowX, windowY, 300, p.windowHeight - windowY);

    

    p5Camera = new P5Camera(p, {x: 0, y: 0}, mpChessBoard.squareSize * mpChessBoard.boardSize / 2, mpChessBoard.squareSize * mpChessBoard.boardSize / 2, 1, 0);
    //p5Camera.ShouldResizeWindow(true);

    

    
  }

  p.draw = () => {
    p.background(255);

    
    networkManager.Update();
    chatWindow.Update();

    p5Camera.LoopStart();
    p5Camera.ZoomToFit(mpChessBoard.squareSize * mpChessBoard.boardSize, mpChessBoard.squareSize * mpChessBoard.boardSize, 0);
  
    mpChessBoard.Update();
    
    p5Camera.LoopEnd();
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}


class NetworkManager{
  constructor(p5){
    this.p5 = p5;
    this.socket = io.connect();

    this.client = new Client(p5, this.socket);

    this.socket.on('serverStartUp', (data) => {
      location.reload();
    });

    this.socket.on('ping', (data, callback) => {
      callback('pong');
    });
  }

  Update(){
    this.client.Update();
  }

}

class Client{
  constructor(p5, socket){
    this.socket = socket;
    this.id = socket.id;
    this.name = '';
    this.p5 = p5;

    this.socket.on('setName', (name) => {
      this.name = name;
      console.log('name set to', `"${name}"`);


      if (this.nameButton){
        this.nameButton.value(this.name);
      }

      else{
        this.nameButton = this.p5.createInput(this.name);
        this.nameButton.value(this.name);

        this.nameButton.style('font-size', '20px');
        this.nameButton.style('position', 'absolute');
        this.nameButton.style('top', '0px');
        this.nameButton.style('right', '0px');
        this.nameButton.style('background', 'transparent');
        this.nameButton.style('border', 'none');
        this.nameButton.style('color', 'black');
        this.nameButton.style('z-index', '100');

        this.nameButton.position(this.p5.windowWidth - 300, 0)

        this.nameButton.changed(() => {
          this.name = this.nameButton.value();
          this.socket.emit('setName', this.name);
        });
      }

      
      
    });

    
  }

  Update(){
    // show player list on tab press
    if (this.p5.keyIsDown(71)){
      this.socket.emit('getPlayerList', '', (data) => {
        const playerNames = data.players;
        const pings = data.pings;

        if (this.playerListWindow){
          this.playerListWindow.remove();
        }

        this.playerListWindow = this.p5.createDiv();
        this.playerListWindow.size(600, 400);
        this.playerListWindow.position(this.p5.windowWidth/2 - 300, 30);
        this.playerListWindow.style('border', 'none');
        this.playerListWindow.style('overflow-y', 'hidden');
        this.playerListWindow.style('overflow-x', 'hidden');
        this.playerListWindow.style('z-index', '100');
        this.playerListWindow.style('padding', '10px');
        this.playerListWindow.style('font-size', '20px');
        this.playerListWindow.style('position', 'absolute');
        
        this.playerListWindow.style('background', 'rgba(240, 240, 240, 0.7)');


        for (let i = 0; i < playerNames.length; i++){
          
          const text = playerNames[i] + " - " + pings[i].toFixed(2) + "ms";
          let player = this.p5.createP(text);
          player.style('font-size', '20px');
          player.style('font-family', 'Arial');
          
          player.style('color', playerNames[i] === this.name ? 'blue' : 'black');

          player.style('margin', '10px');
          this.playerListWindow.child(player);
        }
          
      });
    }

    else if (this.playerListWindow){
      this.playerListWindow.remove();
    }
  }

}


class ChatBox{
  constructor(p5, x, y, w, h){
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.messages = [];

    this.isVisibile = true;

    this.maxMessagesOnScreen = 12;

    this.hideChatButton = this.p5.createButton('Hide Chat');
    this.hideChatButton.size(100, 20);
    this.hideChatButton.position(this.x + 10, this.y + this.h - 60);
    this.hideChatButton.mousePressed(() => {
      this.hidden = !this.hidden;
      this.hideChatButton.html(this.hidden ? 'Hide Chat': 'Show Chat');
    });

    
    this.inputBox = this.p5.createInput();
    this.inputBox.position(this.x + 10, this.y + this.h - 30);
    this.inputBox.size(this.w - 20, 20);
    this.inputBox.style('font-size', '20px');
    this.inputBox.style('position', 'absolute');
    this.inputBox.style('bottom', '0px');
    this.inputBox.style('background', 'transparent');
    this.inputBox.style('border', '1px solid black');
    this.inputBox.style('color', 'black');
    this.inputBox.style('z-index', '100');

    networkManager.socket.on('chatMessage', (message) => {
      console.log('new chat', message);

      // add newline characters to the message if it is too long
      for (let j = 0; j < message.message.length; j++){
        if (j === 0){
          message.message = '\n' + message.message;
          continue;
        }

        if (j % 30 === 0){
          if (message.message[j] !== ' '){
            for (let k = j; k > 0; k--){
              if (message.message[k] === ' '){
                message.message = message.message.substring(0, k) + '\n' + message.message.substring(k, message.message.length);
                break;
              }
            }
          }
          else{
            message.message = message.message.substring(0, j) + '\n' + message.message.substring(j, message.message.length);
          }
         
        }
      }

      this.AddMessage(message);
    });

  }

  AddMessage(message){
    this.messages.push(message);
  }

  SetMessages(messages){
    this.messages = messages;
  }

  Show(){
    if (!this.isVisibile){
      return;
    }
    
    const transparentColor = this.p5.color(240, 240, 240, 200);

    this.p5.fill(transparentColor);

    console.log(this.x, this.y, this.w, this.h);
    this.p5.rect(this.x, this.y, this.w, this.h);

    let yCounter = this.y + 20;
    for (let i = this.messages.length - this.maxMessagesOnScreen; i < this.messages.length; i++){
      if (i < 0){
        continue;
      }

      const bottomMargin = 75;
      if (yCounter > this.h - bottomMargin){
        this.messages.shift();
        continue;
      }

      this.p5.textSize(20);
      this.p5.fill(0);

      const maxLength = 25;
      let name = this.messages[i].name.length > maxLength ? this.messages[i].name.substring(0, maxLength) : this.messages[i].name;

      const splitText = this.messages[i].message.split(/\n/g);

      this.p5.push();

      this.p5.textFont('Arial');
      if (this.messages[i].name === "Server"){
        this.p5.textStyle(this.p5.BOLD);
        this.p5.fill("red");
        name = "SERVER"
      }

      else{
        this.p5.fill(this.messages[i].name === networkManager.client.name ? "blue" : "red");
      }

      this.p5.text(`${name}:`, this.x + 5, yCounter);

      this.p5.textStyle(this.p5.NORMAL);
      this.p5.fill(this.messages[i].name === "Server" ? "red": "black");
      for (let j = 0; j < splitText.length; j++){
        this.p5.text(`${splitText[j]}`, this.x + 5, yCounter);
        yCounter += 25;
      }

      this.p5.pop();

  
      yCounter += 10;
    }
  }

  Update(){
    this.Show();
    this.inputBox.changed(() => {
      networkManager.socket.emit('chatMessage', this.inputBox.value());
      this.inputBox.value('');
    });
  }

  set hidden(isHidden){
    this.isVisibile = isHidden;
    if (this.isVisibile){
      this.inputBox.show();
    }

    else{
      this.inputBox.hide()
    }
    
  }

  get hidden(){
    return this.isVisibile;
  }
}










class PieceRenderer{
  constructor(p5){
    this.p5 = p5;

    this.images = {};
  }

  Preload(){
    this.images[PieceTypes.types.white_pawn] = this.p5.loadImage('images/white_pawn.svg');
    this.images[PieceTypes.types.white_rook] = this.p5.loadImage('images/white_rook.svg');
    this.images[PieceTypes.types.white_knight] = this.p5.loadImage('images/white_knight.svg');
    this.images[PieceTypes.types.white_bishop] = this.p5.loadImage('images/white_bishop.svg');
    this.images[PieceTypes.types.white_queen] = this.p5.loadImage('images/white_queen.svg');
    this.images[PieceTypes.types.white_king] = this.p5.loadImage('images/white_king.svg');

    this.images[PieceTypes.types.black_pawn] = this.p5.loadImage('images/black_pawn.svg');
    this.images[PieceTypes.types.black_rook] = this.p5.loadImage('images/black_rook.svg');
    this.images[PieceTypes.types.black_knight] = this.p5.loadImage('images/black_knight.svg');
    this.images[PieceTypes.types.black_bishop] = this.p5.loadImage('images/black_bishop.svg');
    this.images[PieceTypes.types.black_queen] = this.p5.loadImage('images/black_queen.svg');
    this.images[PieceTypes.types.black_king] = this.p5.loadImage('images/black_king.svg');
  }

  DrawPieces(gameGrid, boardSize, squareSize){
    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);
    
    
    

    for (let i = 0; i < boardSize; i++){
      for (let j = 0; j < boardSize; j++){
        if (gameGrid[j][i] !== PieceTypes.types.empty){
          this.p5.push();
  
          const img = this.images[gameGrid[j][i]];
    
          this.p5.copy(img, 0, 0, img.width, img.height, i * squareSize, j * squareSize, squareSize, squareSize);
          this.p5.pop();
        }
      }
    }



    this.p5.pop();
  }
}


class MPChessBoard{
  #myTurn = false;

  constructor(p5){
    this.p5 = p5;
    this.board = [];
    this.boardSize = 8;
    this.squareSize = 80;

    this.gameGrid = new GameGrid();
    this.gameHistory = new GameHistory(this.gameGrid.grid);

    this.renderer = new PieceRenderer(p5);
    this.renderer.Preload();

    this.socket = networkManager.socket;


    this.socket.on('getGameId', (data, callback) => {
      const gameId = localStorage.getItem('gameId');

      callback(gameId);
    });

    this.socket.on('createBoard', (data) => {
      const side = data.side;

      this.side = side;
      this.opponentSide = side === 'white' ? 'black' : 'white';

      this.gameGrid.grid = data.board;


      localStorage.setItem('gameId', data.gameId);

      this.#createBoard();
    });

    this.socket.on('takeTurn', (data) => { 
      console.log('opponent turn');

      this.gameGrid.grid = data.board;

      if (data.side === this.side){
        console.log('my turn');
        this.#takeTurn();
      }
    });
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

    for (let i = 0; i < this.boardSize; i++){
      for (let j = 0; j < this.boardSize; j++){
        this.p5.fill(this.board[i][j] === 1 ? this.p5.color(255) : this.p5.color(0, 100, 0));
        this.p5.rect(i * this.squareSize, j * this.squareSize, this.squareSize, this.squareSize);
      }
    }

    this.p5.pop();
  }

  #takeTurn(){
    this.#myTurn = true;
  }

  Update(){
    if (this.board.length === 0) return;
    this.#drawBoard();

    const flippedGrid = structuredClone(this.gameGrid.grid);

    if (this.side === 'black') flippedGrid.reverse();

    if (this.side === 'black'){
      for (let i = 0; i < flippedGrid.length; i++){
        flippedGrid[i].reverse();
      }
    }
    

    this.renderer.DrawPieces(flippedGrid, this.boardSize, this.squareSize);


    if (!this.#myTurn) return;

    function compareBoards(board1, board2){
      if (board1.length !== board2.length || board1[0].length !== board2[0].length){
        return false;
      }

      for (let i = 0; i < board1.length; i++){
        for (let j = 0; j < board1[i].length; j++){
          if (board1[i][j] !== board2[i][j]){
            return false;
          }
        }
      }

      return true;
    }
    
    if (this.p5.mouseIsPressed && this.selectedPiece === null){
      this.selectedPiece = this.gameGrid.getClickedPiece(this.p5.mouseX, this.p5.mouseY);
    }

    else if (!this.p5.mouseIsPressed && this.selectedPiece !== null){
      const clickedPiece = this.gameGrid.getClickedPiece(this.p5.mouseX, this.p5.mouseY);

      //reverse the selcted piece if the player is black
      if (this.side === 'black' && this.selectedPiece !== null && this.selectedPiece !== undefined){

        this.selectedPiece.i = this.boardSize - 1 - this.selectedPiece.i;
        this.selectedPiece.j = this.boardSize - 1 - this.selectedPiece.j;

        clickedPiece.i = this.boardSize - 1 - clickedPiece.i;
        clickedPiece.j = this.boardSize - 1 - clickedPiece.j;

        this.selectedPiece.piece = this.gameGrid.grid[this.selectedPiece.j][this.selectedPiece.i];
      }


      

      if (clickedPiece.i < 0 || clickedPiece.i >= this.boardSize || clickedPiece.j < 0 || clickedPiece.j >= this.boardSize){
        this.selectedPiece = null;
        return;
      }

      if (this.selectedPiece === null || this.selectedPiece === undefined){
        this.selectedPiece = null;
        return;
      }

      if (this.selectedPiece.piece > 6 && this.side === 'white'){
        this.selectedPiece = null;
        return;
      }

      else if (this.selectedPiece.piece < 7 && this.side === 'black'){
        this.selectedPiece = null;
        return;
      }
      
      

      const newGrid = Action.MovePiece(this.selectedPiece.piece, structuredClone(this.gameGrid.grid), this.selectedPiece.j, this.selectedPiece.i, clickedPiece.j, clickedPiece.i, this.gameHistory);
      if (!compareBoards(newGrid, this.gameGrid.grid)){
        this.gameGrid.grid = newGrid;
        
        if (this.gameGrid.grid[clickedPiece.j][clickedPiece.i] === this.selectedPiece.piece){
          this.gameHistory.AddMove({piece: this.selectedPiece.piece, board: this.gameGrid.grid});
        }
        
        const gridClone = structuredClone(this.gameGrid.grid);
        this.socket.emit('endTurn', {board: gridClone, i: this.selectedPiece.i, j: this.selectedPiece.j, h: clickedPiece.j, k: clickedPiece.i, piece: this.selectedPiece.piece});
        
      
        this.#myTurn = false;
      }

      if (Action.CheckMate(structuredClone(this.gameGrid.grid), this.selectedPiece.piece, this.selectedPiece.j, this.selectedPiece.i, clickedPiece.j, clickedPiece.i)){
        // Create a checkmate screen

        

      }
      
      this.selectedPiece = null;
      
    }

  }


}

class ChessBoard{
  constructor(p5){
    this.p5 = p5;
    this.board = [];
    this.boardSize = 8;
    this.squareSize = 80;

    this.turn = 'white';
    

    this.#createBoard();
    this.gameGrid = new GameGrid();
    this.gameHistory = new GameHistory(this.gameGrid.grid);
    
    this.renderer = new PieceRenderer(p5);
    
    this.renderer.Preload();


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

    for (let i = 0; i < this.boardSize; i++){
      for (let j = 0; j < this.boardSize; j++){
        this.p5.fill(this.board[i][j] === 1 ? this.p5.color(255) : this.p5.color(0, 100, 0));
        this.p5.rect(i * this.squareSize, j * this.squareSize, this.squareSize, this.squareSize);
      }
    }

    this.p5.pop();
  }

  #drawPieces(){
    this.renderer.DrawPieces(this.gameGrid.grid, this.boardSize, this.squareSize);
  }

  Update(){
    this.#drawBoard();
    this.#drawPieces();

    function compareBoards(board1, board2){
      if (board1.length !== board2.length || board1[0].length !== board2[0].length){
        return false;
      }

      for (let i = 0; i < board1.length; i++){
        for (let j = 0; j < board1[i].length; j++){
          if (board1[i][j] !== board2[i][j]){
            return false;
          }
        }
      }

      return true;
    }
    
    if (this.p5.mouseIsPressed && this.selectedPiece === null){
      this.selectedPiece = this.gameGrid.getClickedPiece(this.p5.mouseX, this.p5.mouseY);
    }

    else if (!this.p5.mouseIsPressed && this.selectedPiece !== null){
      const clickedPiece = this.gameGrid.getClickedPiece(this.p5.mouseX, this.p5.mouseY);
      
      if (this.selectedPiece !== null && this.selectedPiece !== undefined){
        if (this.turn === 'white' && this.selectedPiece.piece > 6){
          this.selectedPiece = null;
          return;
        }

        else if (this.turn === 'black' && this.selectedPiece.piece < 7){
          this.selectedPiece = null;
          return;
        }
      }

      if (clickedPiece.i < 0 || clickedPiece.i >= this.boardSize || clickedPiece.j < 0 || clickedPiece.j >= this.boardSize){
        this.selectedPiece = null;
        return;
      }

      if (this.selectedPiece === null || this.selectedPiece === undefined){
        return;
      }
      
      const newGrid = Action.MovePiece(this.selectedPiece.piece, structuredClone(this.gameGrid.grid), this.selectedPiece.j, this.selectedPiece.i, clickedPiece.j, clickedPiece.i, this.gameHistory);
      if (!compareBoards(newGrid, this.gameGrid.grid)){
        this.gameGrid.grid = newGrid;
        this.turn = this.turn === 'white' ? 'black' : 'white';
      }

      if (Action.CheckMate(structuredClone(this.gameGrid.grid), this.selectedPiece.piece, this.selectedPiece.j, this.selectedPiece.i, clickedPiece.j, clickedPiece.i)){
        // Create a checkmate screen



      }
      

      if (this.gameGrid.grid[clickedPiece.j][clickedPiece.i] === this.selectedPiece.piece){
        this.gameHistory.AddMove({piece: this.selectedPiece.piece, board: this.gameGrid.grid});
        
      }
      
      
      this.selectedPiece = null;
    }
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

  getClickedPiece(x, y){
    const worldPos = p5Camera.ScreenToWorld(x, y);
    const squareSize = 80;

    const i = Math.floor(worldPos.x / squareSize);
    const j = Math.floor(worldPos.y / squareSize);

    return {i, j, piece: this.grid[j][i]};
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

let gameWindowSketch;
window.addEventListener('load', () => {
  gameWindowSketch = new p5(loadingSketch);

});

































// const gpu = new GPU.GPU();

// const generateGameGrid = (width, height) => {
//   const grid = [];
//   for (let i = 0; i < height; i++){
//     grid.push([]);
//     for (let j = 0; j < width; j++){
//       grid[i].push(Math.floor(Math.random() * 2));
//     }
//   }

//   return grid;
// }



// function newGeneration(grid, width, height){
//   const gameOfLife = gpu.createKernel(function(grid, width, height) {
//     const x = this.thread.x;
//     const y = this.thread.y;
//     let numNeighbors = 0;
  
//     for (let i = -1; i < 2; i++){
//       for (let j = -1; j < 2; j++){

  
//         const neighborX = x + i;
//         const neighborY = y + j;
        
//         if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height){
//           numNeighbors += grid[neighborY][neighborX];
//         }
  
//       }
//     }
  
  
//     if (grid[y][x] === 1){
//       numNeighbors -= 1;
//       if (numNeighbors < 2 || numNeighbors > 3){
//         return 0;
//       }
  
//       return 1;
//     }
  
//     else{
//       if (numNeighbors === 3){
//         return 1;
//       }
  
//       return 0;
//     }


    
//   }).setOutput([width, height]);
  

//   return gameOfLife(grid, width, height);
// }




//   let oldGrid = generateGameGrid(100, 100);

//   let loopProgress = [0, 0]

//   let timeout;

//   let gpuSketch = function(p5){
//     p5.setup = () => {
//       p5.createCanvas(p5.windowWidth, p5.windowHeight);
//       p5.noStroke();
      
//       p5.background(255);
//       p5.frameRate(10)
//     }

//     p5.draw = () => {
//       console.log(p5.frameRate());


//       const generationsPerFrame = 1;
//       let newGrid;

//       for (let i = 0; i < generationsPerFrame; i++){
//         try{
//           newGrid = newGeneration(oldGrid, oldGrid[0].length, oldGrid.length);
//           oldGrid = newGrid;
//         }

//         catch(e){
//           newGrid = oldGrid;
//           console.log(e);
//         }
        
//       }
       
      


    
//       const start = performance.now();

      

      

//       for (let i = loopProgress[0]; i < newGrid.length; i++){
//         for (let j = loopProgress[1]; j < newGrid[i].length; j++){
//           const size = 5;
          

//           if (performance.now() - start > 1000/60){
//             loopProgress = [i, j];
//             return;
//           }

//           p5.fill(newGrid[i][j] === 1 ? 0 : 255);
//           p5.rect(i * size, j * size, size, size);
          

          
//         }

//         loopProgress[1] = 0;
    
//       }

//       loopProgress = [0, 0];

      

     
      
      
      
//     }
//   }

  // let gpuSketchInstance = new p5(gpuSketch);
  