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
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _;

@Component({
    selector: 'field-email-addresses',
    templateUrl: './src/objectfields/templates/fieldemailaddresses.html'
})
export class fieldEmailAddresses extends fieldGeneric implements OnInit {
    /**
     * holds the input radio unique name for the primary radio button
     */
    public primaryInputRadioName: string =  _.uniqueId('field-email-address-');

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        if (!this.model.getField('emailaddresses')) {
            this.model.initializeField(
                'emailaddresses',
                [{
                    id: this.model.generateGuid(),
                    bean_id: this.model.id,
                    bean_module: this.model.module,
                    email_address: '',
                    email_address_id: '',
                    primary_address: '1'
                }]
            );
        }
    }

    get emailAddresses() {
        return this.model.getField(this.fieldname);
    }

    private sendEmail(emailaddress) {
        if (emailaddress.invalid_email !== '1') {
            window.location.assign('mailto:' + emailaddress.email_address);
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private setprimary(id) {
        for (let emailaddress of this.model.data.emailaddresses) {
            if (emailaddress.id == id) {
                emailaddress.primary_address = "1";
            } else {
                emailaddress.primary_address = "0";
            }
        }
    }

    private addEmailAddress() {
        this.model.getField('emailaddresses').push({
            id: this.model.generateGuid(),
            bean_id: this.model.id,
            bean_module: this.model.module,
            email_address: '',
            email_address_id: '',
            primary_address: '0'
        });
    }

    private handleOnBlur() {
        let emailAddresses = [];
        // get the email addresses
        this.model.getField('emailaddresses')
            .filter(emailAddress => emailAddress.email_address != '')
            .forEach(emailAddress => {
                if (!emailAddresses.some(e => e.email_address == emailAddress.email_address)) emailAddresses.push(emailAddress);
            });

        // get the primary email address
        let primaryEmailAddress = emailAddresses.find(emailAddress => emailAddress.primary_address == '1');
        // if no primary was set take the first entry
        if (!primaryEmailAddress && emailAddresses.length > 0) {
            emailAddresses[0].primary_address = '1';
            primaryEmailAddress = emailAddresses[0];
        }

        this.model.setFields({
            emailaddresses: emailAddresses,
            email1: primaryEmailAddress.email_address
        });
    }
}

