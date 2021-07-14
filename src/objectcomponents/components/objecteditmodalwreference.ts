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
 * @module ObjectComponents
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef, EventEmitter
} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    templateUrl: './src/objectcomponents/templates/objecteditmodalwreference.html',
    providers: [model, view]
})
export class ObjectEditModalWReference {
    @ViewChild('modalContent', {read: ViewContainerRef, static: true}) modalContent: ViewContainerRef;
    componentRefs: Array<any> = [];
    componentSet: String = '';
    module: String = '';
    reference: string = '';
    showDuplicates: boolean = false;

    doDuplicateCheck: boolean = true;
    duplicates: Array<any> = [];

    modalAction$: EventEmitter<any> = new EventEmitter<any>();

    self: any = {};

    constructor(private router: Router, private language: language, private model: model, private view: view, private metadata: metadata, private elementref: ElementRef) {
        this.view.isEditable = true;
        this.view.setEditMode();

    }

    closeModal() {
        this.modalAction$.emit(false);
    }

    get modalHeader(){
        return this.model.module != '' ? this.language.getModuleName(this.model.module, true) : '';
    }

    save(goDetail: boolean = false) {
        if (this.model.validate()) {
                this.modalAction$.emit(this.model.data);
        }
        else {
            console.log(this.model.messages);
        }
    }


    /*
     style function to prevent overflow to display scrollbar when duplicate check is displayed
     */
    get contentStyle() {
        if (this.showDuplicates) {
            return {
                'overflow-y': 'hidden'
            }
        }
    }
}