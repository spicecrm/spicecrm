/**
 * Created by maretval on 14.09.2017.
 */

var canvaApp = function(){
};
canvaApp.prototype = {
    id: null,
    context: null,
    canvas: null,
    clickX: [],
    clickY: [],
    clickDrag: [],
    canvasWidth: null,
    canvasHeight: null,
    mouseX: null,
    mouseY:null,
    sizeHotspotStartX: null,
    paint: false,
    strokeStyle: '#000000',
    lineJoin: 'round',
    lineWidth: 5,

    init: function(canvasDivId, canvasWidth, canvasHeight){
        this.id = canvasDivId;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // Create the canvas (Necessary for IE because it doesn't know what a canvas element is)
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', canvasWidth);
        this.canvas.setAttribute('height', canvasHeight);
        this.canvas.setAttribute('style', 'border: 1px solid #000');
        this.canvas.setAttribute('id', canvasDivId + '_canvas');
        document.getElementById(canvasDivId).appendChild(this.canvas);
        if (typeof G_vmlCanvasManager !== "undefined") {
            this.canvas = G_vmlCanvasManager.initElement(this.canvas);
        }
        this.context = this.canvas.getContext("2d"); // Grab the 2d canvas context

        this.createUserEvents();
    },
    setAttribute: function(property, value){
        this[property] = value;
    },
    createUserEvents: function () {
        _canvaApp = this;
        var press = function (e) {
                // Mouse down location
                _canvaApp.mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                    _canvaApp.mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                _canvaApp.setAttribute('paint', true);
                _canvaApp.addClick(_canvaApp.mouseX, _canvaApp.mouseY, false);
                _canvaApp.redraw();
            },

            drag = function (e) {

                _canvaApp.mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                _canvaApp.mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                if (_canvaApp.paint) {
                    _canvaApp.addClick(_canvaApp.mouseX, _canvaApp.mouseY, true);
                    _canvaApp.redraw();
                }
                // Prevent the whole page from dragging if on mobile
                e.preventDefault();
            },

            release = function () {
                _canvaApp.paint = false;
                _canvaApp.redraw();
            },

            cancel = function () {
                _canvaApp.paint = false;
            },
            over = function(e){
                _canvaApp.mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                _canvaApp.mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
                console.log(_canvaApp.mouseX + ", " + _canvaApp.mouseY);
            };


        // Add mouse event listeners to canvas element
        this.canvas.addEventListener("mousedown", press, false);
        this.canvas.addEventListener("mousemove", drag, false);
        this.canvas.addEventListener("mouseup", release);
        this.canvas.addEventListener("mouseout", cancel, false);
        // this.canvas.addEventListener("mouseover", over, false);

        // Add touch event listeners to canvas element
        this.canvas.addEventListener("touchstart", press, false);
        this.canvas.addEventListener("touchmove", drag, false);
        this.canvas.addEventListener("touchend", release, false);
        this.canvas.addEventListener("touchcancel", cancel, false);
    },
    addClick: function(x, y, dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },
    redraw: function (){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas

        this.context.strokeStyle = this.strokeStyle;
        this.context.lineJoin = this.lineJoin;
        this.context.lineWidth = this.lineWidth;

        for(i=0; i < this.clickX.length; i++) {
            this.context.beginPath();
            if(this.clickDrag[i] && i){
                this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
            }else{
                this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.context.lineTo(this.clickX[i], this.clickY[i]);
            this.context.closePath();
            this.context.stroke();

        }
    },
    clearCanvas: function () {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }


}


// save canva to byte image/octet-stream
var canva2Image = function(){
};
canva2Image.prototype = {
    id: null,
    canvas: null,
    init: function(canvasDivId){
        this.id = canvasDivId + '_canvas';
        this.canvas = document.getElementById(this.id).canvas
    },
    save: function(){
        // save canvas image as data url (png format by default)
        var dataURL = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

        // set canvasImg image src to dataURL
        // so it can be saved as an image
        document.getElementById(canvasDivId).src = dataURL;
    }
}

