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
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'reporter-filter-item-user-single',
    templateUrl: './src/modules/reports/templates/reporterfilteritemusersingle.html'
})
export class ReporterFilterItemUserSingle implements OnInit {
    /**
     * @input whereCondition: object
     */
    @Input() private whereCondition: any = {};
    /**
     * @input fieldName: string
     */
    @Input() private fieldName: string;

    private activeUserName: string = '';

    constructor(private language: language, private modal: modal, private session: session) {
    }

    /**
     * @return activeUser: boolean
     */
    get activeUser() {
        return this.whereCondition.value.indexOf('current_user_id') > -1;
    }

    /**
     * add/remove active user from the value by checkbox value
     * @param value: boolean
     */
    set activeUser(value) {
        this.value = !value ? [''] : ['current_user_id'];
    }

    /**
     * @return value: string
     */
    get value() {
        return this.whereCondition.value;
    }

    /**
     * set whereCondition.value and valueinit
     * @param value: string
     */
    set value(value) {
        if (!value || value.length == 0) return;

        this.whereCondition.valuekey = value[0];
        this.whereCondition.value = value[0];
    }

    /**
     * set the activeUserName
     */
    public ngOnInit() {
        this.activeUserName = this.session.authData.userName;
    }

    /**
     * clear relate fields
     */
    private clearField() {
        this.whereCondition.value = '';
        this.whereCondition.valuekey = '';
    }

    /**
     * opens module lookup modal
     */
    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.value = items.map(u => u.user_name);
                }
            });
        });
    }
}
