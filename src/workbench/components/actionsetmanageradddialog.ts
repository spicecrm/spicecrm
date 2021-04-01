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
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter, OnChanges, SimpleChanges,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';

@Component({
    selector: 'actionsetmanager-add-dialog',
    templateUrl: './src/workbench/templates/actionsetmanageradddialog.html'
})
export class ActionsetManagerAddDialog implements OnInit  {

    @Input() public sysModules = [];
    @Input() public actionsetModule: string = '';
    @Input() public mode: string = '';
    @Input() public edit_mode: string = '';
    @Input() public actionsetName: string = '';

    @Output() public closedialog: EventEmitter<any> = new EventEmitter<any>();

    private actionsetType: string = 'custom';

    private globalEdit: boolean = false;

    private modalTitle: string = "";

    private self;

    constructor(private backend: backend, private metadata: metadata, private language: language) {}

    public ngOnInit() {
        if(this.mode == "copy") {
            this.modalTitle = this.language.getLabel('LBL_COPY_ACTIONSET');
        } else {
            this.modalTitle = this.language.getLabel('LBL_NEW_ACTIONSET');
        }
    }

    private closeDialog() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.closeDialog();
    }

    private add() {
        this.closedialog.emit({name: this.actionsetName, type: this.actionsetType, module: this.actionsetModule});
        this.self.destroy();
    }

}