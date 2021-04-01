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
 * @module ModuleGroupware
 */
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from '../../../services/model.service';
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

/**
 * The detailed view of a bean.
 */
@Component({
    selector: 'groupware-detail-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanebean.html',
    providers: [view, model]
})
export class GroupwareDetailPaneBean implements OnInit {

    /**
     * Current bean.
     */
    @Input() private bean: any;
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(
        private groupware: GroupwareService,
        private language: language,
        private metadata: metadata,
        private model: model,
        private router: Router,
        private view: view
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {

        this.model.module = this.bean.module;
        this.model.id = this.bean.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.bean.data);

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig(
            'GlobalHeaderSearchResultsItem', // todo create its own config if needed
            this.model.module
        );
        if (componentconfig && componentconfig.mainfieldset) {
            this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        }
        if (componentconfig && componentconfig.subfieldset) {
            this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
        }
    }

    private onClick(event) {
        this.selected.emit({module: this.bean.module, id: this.bean.id});
        // this.router.navigate(['module/' + this.bean.module + '/' + this.bean.id]);
    }
}
