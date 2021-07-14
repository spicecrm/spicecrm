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
    ElementRef,
    Renderer2,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnInit,
    AfterViewInit, NgZone
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import {helper} from '../../services/helper.service';
import {layout} from '../../services/layout.service';
import {ObjectActionContainer} from "./objectactioncontainer";

@Component({
    selector: 'object-action-menu',
    templateUrl: './src/objectcomponents/templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu extends ObjectActionContainer implements OnInit {

    @Input() private buttonsize: string = '';

    @Input() public actionset: string = '';

    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    public componentconfig: any = {};

    constructor(public language: language,
                private broadcast: broadcast,
                public model: model,
                private view: view,
                public metadata: metadata,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private helper: helper,
                private layout: layout,
                public cdRef: ChangeDetectorRef,
                public ngZone: NgZone) {
        super(language, metadata, model,  ngZone, cdRef);
    }

    public ngOnInit() {
        if(this.actionset == "") {
            this.componentconfig = this.metadata.getComponentConfig('ObjectActionMenu', this.model.module);
            this.actionset = this.componentconfig.actionset_default;
            this.setActionsets();
        }
    }

    public ngOnChanges() {
        this.setActionsets();
    }

    public setActionsets() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.actionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            this.actionitems.push({
                disabled: true,
                id: actionitem.id,
                sequence: actionitem.sequence,
                action: actionitem.action,
                component: actionitem.component,
                actionconfig: actionitem.actionconfig
            });
        }

        // trigger Change detection to ensure the changes are renderd if cdref is on push mode on the parent component
        // happens amongst other scenarios in the list view
        this.cdRef.detectChanges();
    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    get hasNoActions() {
        // because of custom actions can't be checked if they are enabled... return false
        if (this.actionitems.length > 0) return false;

        return true;
    }

    private getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }
}
