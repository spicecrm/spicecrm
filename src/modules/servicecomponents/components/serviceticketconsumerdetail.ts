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
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnDestroy, OnInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketconsumerdetail.html',
    providers: [model]
})
export class ServiceTicketConsumerDetail implements OnDestroy, OnInit {

    /**
     * the componentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * the fieldset rendered in the header
     */
    private headerfieldset: string;

    /**
     * the componentset rendered in the body
     */
    private componentset: string;

    /**
     * any subscription the component might have that are killed on destroy
     */
    private subscriptions: Subscription = new Subscription();

    constructor(@SkipSelf() private parent: model, private model: model, private metadata: metadata, private language: language) {
        this.model.module = 'Consumers';
        this.subscriptions.add(this.parent.data$.subscribe(ticketdata => {
            this.loadConsumer();
        }));
    }

    public ngOnInit(): void {
        this.componentset = this.componentconfig.componentset;
        this.headerfieldset = this.componentconfig.headerfieldset;
    }

    /**
     * unsubscribe from the model on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns a contactid if one is set on the parent model (the ticket
     */
    get consumerid() {
        return this.parent.getField('parent_type') == 'Consumers' ? this.parent.getField('parent_id') : this.parent.getField('consumer_id');
    }

    /**
     * loads the contact on change
     */
    private loadConsumer() {
        if (this.consumerid && this.consumerid != this.model.id) {
            this.model.id = this.consumerid;
            this.model.getData();
        }
    }

}
