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
        this.p5.rect(this.x, this.y, this.width, this.height);
        this.elements.forEach(element => {
            element.Update();
        });
    }
}

class UIElement{
    constructor(p5, widget, x, y, width, height){
        this.p5 = p5;
        this.widget = widget;
        widget.AddElement(this);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
    }

    Update(){

    }
}

