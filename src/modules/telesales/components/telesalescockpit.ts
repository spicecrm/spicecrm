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
 * @module ModuleTeleSales
 */
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './src/modules/telesales/templates/telesalescockpit.html',
    providers: [
        telecockpitservice,
        view,
        model
    ]
})

export class TeleSalesCockpit implements OnDestroy {

    /**
     * handles the subscriptions for the component
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private navigationtab: navigationtab,
                private telecockpitservice: telecockpitservice) {
        this.selectedListItemSubscriber();

        this.navigationtab.setTabInfo({displayname: 'Telesales'});
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private selectedListItemSubscriber() {
        this.subscriptions.add(this.telecockpitservice.selectedListItem$.subscribe(listItem => this.loadModel(listItem)));
    }

    private loadModel(selectedListItem) {
        this.model.reset();
        if (!selectedListItem) {
            return;
        }
        this.model.module = selectedListItem.target_type;
        this.model.id = selectedListItem.data.id;
        this.model.data = selectedListItem.data;
    }
}
