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
 * @module AddComponentsModule
 */
import {
    Component,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {modelutilities} from '../../services/modelutilities.service';
import {userpreferences} from '../../services/userpreferences.service';
import {language} from '../../services/language.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'spice-timestream',
    templateUrl: './src/addcomponents/templates/spicetimestream.html'
})
export class SpiceTimestream {

    @ViewChild('streamwindow', {read: ViewContainerRef, static: true}) streamwindow: ViewContainerRef;

    modellistsubscribe: any = undefined;
    requestedFields: Array<string> = [];

    focusDate = new moment();

    timestream: any = {
        period: 'y',
        dateStart: null,
        dateEnd: null,
    }

    constructor(private language: language, private userpreferences: userpreferences, private model: model, private modellist: modellist, private modelutilities: modelutilities, private metadata: metadata) {

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        this.requestedFields = ['name', 'account_name', 'account_id', 'sales_stage', 'amount_usdollar', 'amount'];
        this.modellist.getListData(this.requestedFields);

        // set start and end
        this.period = 'y';

    }

    switchListtype() {
        let requestedFields = [];
        this.modellist.getListData(this.requestedFields);
    }

    get period() {
        return this.timestream.period;
    }

    set period(period) {
        switch (period) {
            case 'M':
                let curmonth = moment(this.focusDate).month();

                this.timestream.dateStart = new moment(this.focusDate);
                this.timestream.dateStart.month(curmonth);
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.day(0);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month(curmonth);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.day(6);
                this.timestream.dateEnd.hour(23)
                this.timestream.dateEnd.minute(59);
                break;
            case 'Q':
                let month = moment(this.focusDate).month() + 1;

                this.timestream.dateStart = new moment(this.focusDate);

                this.timestream.dateStart.month(3 * Math.floor(month / 3));
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month((3 * Math.floor(month / 3)) + 3);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.hour(23)
                this.timestream.dateEnd.minute(59);
                break;
            case 'y':
                this.timestream.dateStart = new moment(this.focusDate)
                this.timestream.dateStart.month(0);
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month(11);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.hour(23)
                this.timestream.dateEnd.minute(59);
                break;
        }
        this.timestream.period = period;

    }

    get periodText() {
        switch (this.timestream.period) {
            case 'M':
                return moment(this.timestream.dateStart).day(6).format('MMM/Y')
            case 'Q':
                return this.timestream.dateStart.format('Q/Y');
            case 'y':
                return this.timestream.dateStart.format('Y');
        }
    }

    prev() {
        this.focusDate.subtract(1, this.timestream.period);
        this.period = this.timestream.period;
        /*
        switch(this.timestream.period) {
            case 'M':
                this.timestream.dateStart.subtract(1, this.timestream.period);
                this.timestream.dateEnd.subtract(1, this.timestream.period);
                break;
            default:
                this.timestream.dateStart.subtract(1, this.timestream.period);
                this.timestream.dateEnd.subtract(1, this.timestream.period);
                break;
        }
        */
    }

    next() {
        this.focusDate.add(1, this.timestream.period);
        this.period = this.timestream.period;
        /*
        switch(this.timestream.period) {

            default:
                this.timestream.dateStart.add(1, this.timestream.period);
                this.timestream.dateEnd.add(1, this.timestream.period);
        }
        */
    }

}