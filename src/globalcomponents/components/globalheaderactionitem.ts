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
 * @module GlobalComponents
 */
import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {dockedComposer} from '../../services/dockedcomposer.service';

@Component({
    selector: 'global-header-action-item',
    templateUrl: './src/globalcomponents/templates/globalheaderactionitem.html',
    providers: [model]
})
export class GlobalHeaderActionItem implements OnInit {

    public actionconfig: any = {};
    private closemenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private session: session, private metadata: metadata, private model: model, private language: language, private dockedComposer: dockedComposer) {

    }

    public ngOnInit() {
        if (this.actionconfig.module) {
            this.model.module = this.actionconfig.module;
        }
    }

    private click() {
        this.dockedComposer.addComposer(this.model.module);
        this.closemenu.emit(true);
    }

    get label() {
        if (this.actionconfig.label) {
            return this.language.getLabel(this.actionconfig.label);
        } else {
            return this.language.getLabel(this.model.module, 'LBL_NEW_FORM_TITLE');
        }
    }
}
