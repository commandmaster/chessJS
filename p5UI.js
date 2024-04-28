class UIWidget{
    constructor(p5, x, y, width, height){
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.elements = [];
    }

    AddElement(element){
        this.elements.push(element);
    }

    Update(){
        console.log(this.x, this.y, this.width, this.height);
        this.p5.fill(0, 0, 0);
        this.p5.rect(this.x, this.y, this.width, this.height);
        this.elements.forEach(element => {
            element.Update();
        });
    }
}

class UIElement{
    constructor(p5, widget, x, y, width, height, anchor='top-left'){
        this.p5 = p5;
        this.widget = widget;
        widget.AddElement(this);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.anchor = anchor;
        
    }

    Update(){
        this.p5.textAlign(this.p5.CENTER);
    }
}

class UIButton extends UIElement{
    constructor(p5, widget, x, y, width, height, anchor='top-left'){
        super(p5, widget, x, y, width, height, anchor);
    }

    Update(){
        let x, y;
        const baseResWidth = 1920;
        const baseResHeight = 1080;


        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        
        if (this.anchor == 'top-left'){
            x = this.x * (this.p5.width / baseResWidth);
            y = this.y * (this.p5.height / baseResHeight);
        }

        if (this.anchor == 'top-right'){
            x = this.x * (this.p5.width / baseResWidth) - this.width;
            y = this.y * (this.p5.height / baseResHeight);
        }

        if (this.anchor == 'bottom-left'){
            x = this.x * (this.p5.width / baseResWidth);
            y = this.y * (this.p5.height / baseResHeight) - this.height;
        }

        if (this.anchor == 'bottom-right'){
            x = this.x * (this.p5.width / baseResWidth) - this.width;
            y = this.y * (this.p5.height / baseResHeight) - this.height;
        }

        if (this.anchor == 'center'){
            x = this.x * (this.p5.width / baseResWidth) - this.width/2;
            y = this.y * (this.p5.height / baseResHeight) - this.height/2;
        }

        this.p5.fill(255, 0, 0);
        

        if (this.p5.mouseX > x && this.p5.mouseX < x + this.width && this.p5.mouseY > y && this.p5.mouseY < y + this.height && this.p5.mouseIsPressed){
            this.p5.fill(10, 10, 10);
        }

        this.p5.rect(x, y, this.width, this.height);
    }
}

class UIText extends UIElement{
    constructor(p5, widget, x, y, width, height, text, anchor='top-left'){
        super(p5, widget, x, y, width, height, anchor);
        this.text = text;
    }

    Update(){
        let x, y;
        const baseResWidth = 1920;
        const baseResHeight = 1080;

        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        
        if (this.anchor == 'top-left'){
            x = this.x * (this.p5.width / baseResWidth);
            y = this.y * (this.p5.height / baseResHeight);
        }

        if (this.anchor == 'top-right'){
            x = this.x * (this.p5.width / baseResWidth) - this.width;
            y = this.y * (this.p5.height / baseResHeight);
        }

        if (this.anchor == 'bottom-left'){
            x = this.x * (this.p5.width / baseResWidth);
            y = this.y * (this.p5.height / baseResHeight) - this.height;
        }

        if (this.anchor == 'bottom-right'){
            x = this.x * (this.p5.width / baseResWidth) - this.width;
            y = this.y * (this.p5.height / baseResHeight) - this.height;
        }

        if (this.anchor == 'center'){
            x = this.x * (this.p5.width / baseResWidth) - this.width/2;
            y = this.y * (this.p5.height / baseResHeight) - this.height/2;
        }



        this.p5.text(this.text, x, y, this.width, this.height);
    }
}