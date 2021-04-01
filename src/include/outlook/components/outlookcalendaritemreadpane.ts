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
 * @module Outlook
 */

import {Component} from "@angular/core";


import {GroupwareService} from "../../../include/groupware/services/groupware.service";

@Component({
    templateUrl: './src/include/outlook/templates/outlookcalendaritemreadpane.html'
})
export class OutlookCalendarItemReadPane {

    /**
     * the outlook calendar item id
     */
    private calendaritemid: string;

    /**
     * the module this is linked to
     */
    private module: string;

    /**
     * the id this is linked to
     */
    private id: string;

    /**
     * the custom properties object
     */
    private customProperties: any;

    constructor(
        private groupware: GroupwareService,
    ) {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.calendaritemid = id;
        });

        this.groupware.getCustomProperties().subscribe(props => {
            this.customProperties = props;

            this.module = this.customProperties.get('_module');
            this.id = this.customProperties.get('_id');

            // this.module = 'Meetings';
            // this.id = '105b119a-81c6-f039-e6c0-57bc0c7540e9';
        });
    }

}
