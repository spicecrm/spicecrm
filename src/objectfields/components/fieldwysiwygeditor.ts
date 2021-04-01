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
 * @module ObjectFields
 */
import {AfterViewInit, Component, Input,  ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-wysiwyg-editor',
    templateUrl: './src/objectfields/templates/fieldwysiwygeditor.html',
})
export class fieldWYSIWYGEditor implements AfterViewInit{
    @ViewChild('editor', {read: ViewContainerRef, static: true}) editor: ViewContainerRef;
    @Input() fieldname: string = '';
    fieldSelection: any = undefined;

    constructor(public model: model, public view: view, public language: language, ) {

    }

    get fieldcontent(){

        /*
        if(this.fieldSelection){
            var range = document.createRange();
            range.setStart(this.editor.element.nativeElement.firstChild, 6);
            range.setEnd(this.editor.element.nativeElement.firstChild, 8);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
*/
        return this.model.data[this.fieldname];

    }

    ngAfterViewInit(){
        this.editor.element.nativeElement.innerHTML = this.model.data[this.fieldname];
    }

    eventHandler(event){

        // get content caret
        //debugger;
        this.fieldSelection = window.getSelection();
        // todo: replace with this.value...
        this.model.data[this.fieldname] = event.srcElement.innerHTML;
        // console.log(event);
    }

    onBlur(event){
        console.log(event);
    }
}