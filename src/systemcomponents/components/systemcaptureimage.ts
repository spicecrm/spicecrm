/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    @ViewChild('video', {read: ViewContainerRef, static: true}) video: ViewContainerRef;
    @ViewChild('canvas', {read: ViewContainerRef, static: true}) canvas: ViewContainerRef;

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
        this.backend.postRequest('module/'+ this.model.module +'/' + this.model.id + '/attachment',{},  postBody).subscribe(response => {
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