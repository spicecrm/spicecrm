/**
 * @module SystemComponents
 */
import {Component, Input, AfterViewInit, ViewChild, ViewContainerRef, EventEmitter} from '@angular/core';
import {backend} from '../../services/backend.service';

@Component({
    selector: 'system-capture-image',
    templateUrl: './src/systemcomponents/templates/systemcaptureimage.html'
})
export class SystemCaptureImage implements AfterViewInit{

    @ViewChild('video', {read: ViewContainerRef}) video: ViewContainerRef;
    @ViewChild('canvas', {read: ViewContainerRef}) canvas: ViewContainerRef;

    self: any = {};
    model: any = {};
    stream: any = {};
    imageTaken: boolean = false;
    response$: EventEmitter<any> = new EventEmitter<any>()

    constructor(private backend: backend) {

    }

    ngAfterViewInit(){


        this.startstream();
    }

    startstream(){
        let self = this;
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                self.video.element.nativeElement.src = window.URL.createObjectURL(stream);
                self.video.element.nativeElement.play();
                self.stream = stream;
            });
        }
    }

    stopstream(){
        this.stream.getVideoTracks()[0].stop()
    }

    capture(){

        var context = this.canvas.element.nativeElement.getContext('2d');
        var video = document.getElementById('video');
        context.drawImage(this.video.element.nativeElement, 0, 0, 1024, 768);

        this.stopstream();

        this.imageTaken = true;

    }

    discard(){
        this.video.element.nativeElement.play();
        this.imageTaken = false;
    }

    send(){
        var dataUrl = this.canvas.element.nativeElement.toDataURL();
        let postBody = {
            filename: 'xsxx.png',
            file: dataUrl.replace('data:image/png;base64,', ''),
            filemimetype: 'image/png'
        };
        this.backend.postRequest('/module/'+ this.model.module +'/' + this.model.id + '/attachment',{},  postBody).subscribe(response => {
            this.response$.emit(response[0]);
            this.close();
        })
    }

    close(){
        this.self.destroy();
    }

    onModalEscX() {
        this.close();
    }

}