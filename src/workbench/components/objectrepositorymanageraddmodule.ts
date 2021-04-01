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
    EventEmitter,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';


@Component({
    selector: 'objectrepositorymanager-add-module',
    templateUrl: './src/workbench/templates/objectrepositorymanageraddmodule.html',
    styles: [
        ':host >>> .mce-ico{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-text{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-btn button{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-tinymce{border-radius: 4px}',
        ':host >>> .mce-widget{font-family: \'Titillium Web\', sans-serif;}'
    ]
})
export class ObjectRepositoryManagerAddModule implements OnInit {
    @Output() public closedialog: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public mode: string = 'add';
    @Input() public edit_mode: string = 'custom';
    @Input() public moduleRepo: any = {
        id: "",
        module: "",
        path: "",
        description: "",
        package: "",
        version: "",
        scope: "custom"
    };
    private self;
    private scopes: Array<any> = ["custom", "global"];

    constructor(private backend: backend, private language: language, private modelutilities: modelutilities) {}

    public ngOnInit() {
        if(this.edit_mode == "custom") {
            this.scopes = ["custom"];
        }else {
            this.scopes = ["custom", "global"];
        }
    }
    private closeDialog() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.closeDialog();
    }

    private add() {
        this.closedialog.emit(true);
        this.self.destroy();
    }
    public updateField(desc) {
        this.moduleRepo.description = desc;
    }
}