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
 * @module ModuleTelephony
 */
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

declare var _: any;
declare var libphonenumber: any;

@Component({
    selector: 'telephony-call-panel-related',
    templateUrl: './src/modules/telephony/templates/telephonycallpanelrelated.html',
    providers: [view]
})
export class TelephonyCallPanelRelated implements OnInit{

    /**
     * the main Fieldset
     */
    private mainfieldset: string;

    /**
     * the sub fieldset
     */
    private subfieldset: string;

    constructor(private model: model, private view: view, private metadata: metadata) {
        // no labels
        this.view.displayLabels = false;
    }

    public ngOnInit(): void {
        // load the config
        this.loadconfig();
    }

    /**
     * load the config and fieldsets
     */
    private loadconfig(){
        let config = this.metadata.getComponentConfig('TelephonyCallPanel', this.model.module);
        this.mainfieldset = config.mainfieldset;
        this.subfieldset = config.subfieldset;
    }

}
