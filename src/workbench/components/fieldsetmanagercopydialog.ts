/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'fieldsetmanager-copy-dialog',
    templateUrl: './src/workbench/templates/fieldsetmanagercopydialog.html'
})
export class FieldsetManagerCopyDialog implements OnInit{

    @Input() metaFieldSets: Array<any> = [];
    @Input() fieldset: string = '';
    @Input() sysModules: any = [];
    @Input() edit_mode: string = '';
    @Output() closedialog: EventEmitter<any> = new EventEmitter<any>();

    currentName: string = '';
    currentType: string = '';
    currentModule: string = '';


    self;

    constructor(private language: language) {
    }

    ngOnInit(){
        if(this.fieldset) {
            this.currentName = this.metaFieldSets[this.fieldset].name;
            this.currentModule = this.metaFieldSets[this.fieldset].module;
            if(this.edit_mode == "global"){
                this.currentType = this.metaFieldSets[this.fieldset].type;
            }else{
                this.currentType = "custom";
            }
        }
    }

    closeDialog() {
        this.self.destroy();
    }

    onModalEscX() {
        this.closeDialog();
    }

    copy() {
        this.closedialog.emit({fieldset: this.metaFieldSets[this.fieldset], type: this.currentType, module: this.currentModule, name: this.currentName});
        this.self.destroy();
    }

    validate(){
        if(this.fieldset && this.currentModule && this.currentType){
            return false;
        }else{
            return true;
        }
    }

}
