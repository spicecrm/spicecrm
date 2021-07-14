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
import {Component} from '@angular/core';
import {subscription} from "../../services/subscription.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders a button to toggle subscription on a specific bean
 * requires provided model.service
 */
@Component({
    selector: 'object-subscription-button',
    templateUrl: './src/objectcomponents/templates/objectsubscriptionbutton.html'
})
export class ObjectSubscriptionButton {

    /**
     * indicator that we are subscribging or uinsubscribing currently
     *
     * @private
     */
    private inProcess: boolean = false;

    constructor(private subscriptionService: subscription,
                private metadata: metadata,
                private model: model) {
    }

    /**
     * toggle add/remove subscription for a record
     * called from parent
     */
    public toggleSubscribe() {
        this.inProcess = true;
        if (this.subscriptionService.hasSubscription(this.model.id)) {
            this.subscriptionService.unsubscribeBean(this.model.id, this.model.module).subscribe(
                res => this.inProcess = false,
                err => this.inProcess = false
            );
        } else {
            this.subscriptionService.subscribeBean(this.model.id, this.model.module).subscribe(
                res => this.inProcess = false,
                err => this.inProcess = false
            );
        }
    }
}
