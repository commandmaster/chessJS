class P5Camera{
    #resizeWindow = false;
    

    constructor(p5, centerScreenOffset={x:0, y:0}, startX=0, startY=0, startZoom=1, startRotation=0){
        this.p5 = p5;

        this.centerScreenOffset = centerScreenOffset;

        this.x = startX;
        this.y = startY;
        this.zoom = startZoom;
        this.rotation = startRotation;
        
    }

    ZoomToFit = (width, height, padding=0) => {
        let zoom = Math.min(this.p5.width / (width + padding), this.p5.height / (height + padding));
        this.zoom = zoom;
    }

    LoopStart(){
        this.p5.push();
    }

    Update(){  
        if(this.#resizeWindow){
            this.p5.resizeCanvas(window.innerWidth, window.innerHeight);
        }

        this.p5.translate(this.p5.width/2 + this.centerScreenOffset.x, this.p5.height/2 + this.centerScreenOffset.y);
        this.p5.scale(this.zoom);
        this.p5.rotate(this.rotation);
        this.p5.translate(-this.x, -this.y);
    }

    LoopEnd(){
        this.p5.pop();
    }

    ScreenToWorld(x, y){
        return {
            x: (x - this.p5.width/2 - this.centerScreenOffset.x) / this.zoom + this.x,
            y: (y - this.p5.height/2 - this.centerScreenOffset.y) / this.zoom + this.y
        }
    }

    ShouldResizeWindow(bool){
        this.#resizeWindow = bool;
    }

    
}