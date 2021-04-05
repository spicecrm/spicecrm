/*
SpiceUI 2021.01.001

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
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-cron-interval',
    templateUrl: './src/objectfields/templates/fieldcroninterval.html'
})
export class fieldCronInterval extends fieldGeneric {
    public fieldDescription: any = {
        min: '(0-59) allowed values; 0 is the top of the hour.\n' +
            '(*) first-last (every minute).\n' +
            '(,) a list of minutes; ie. 0,30 would be the 0 AND 30th minutes.\n' +
            '(-) a range of minutes; ie. 0-5 would be minutes 0, 1, 2, 3, 4, and 5 (you can also specify a list of ranges 0-5,30-35).\n' +
            '(/) step values will skip the specified number within a range; ie */5 is every 5 minutes, and 0-30/2 is every 2 minutes between 0 and 30 minutes.',

        hrs: '(0-23) allowed values; 0 is midnight.\n' +
            '(*) first-last (every hour).\n' +
            '(,) a list of hours; ie. 0,12 would be the 0 AND 12th hours.\n' +
            '(-) a range of hours; ie. 19-23 would be hours 19, 20, 21, 22, and 23 (you can also specify a list of ranges 0-5,12-16).\n' +
            '(/) step values will skip the specified number within a range; ie */4 is every 4 hours, and 0-20/2 is every 2 hours between 0 and the 20th hour.',

        date: '1-31) allowed values.\n' +
            '(*) first-last (every day of the month).\n' +
            '(,) a list of days; ie. 1,15 would be the 1st AND 15th day of the month.\n' +
            '(-) a range of days; ie. 1-5 would be days 1, 2, 3, 4, and 5 (you can also specify a list of ranges 1-5,14-30).\n' +
            '(/) step values will skip the specified number within a range; ie */4 is every 4 days, and 1-20/2 is every 2 days between 1st and the 20th day of the month.',

        mo: '(1-12) allowed values.\n' +
            '(JAN-DEC) allowed values.\n' +
            '(*) first-last (every month).\n' +
            '(,) a list of months; ie. 1,6 would be the jan AND jun.\n' +
            '(-) a range of months; ie. 1-3 would be jan, feb, and mar (you can also specify a list of ranges 1-4,8-12).\n' +
            '(/) step values will skip the specified number within a range; ie */4 is every 4 months, and 1-8/2 is every 2 months between jan and aug.',

        day: '(0-6) allowed values; 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday.\n' +
            'SUN-SAT) allowed values.\n' +
            '(*) first-last (every day of the week).\n' +
            '(,) a list of days; ie. 1,5 would be the mon AND fri.\n' +
            '(-) a range of days; ie. 1-5 would be mon, tue, wed, thu, and fri (you can also specify a list of ranges 0-2,4-6).\n' +
            '(/) step values will skip the specified number within a range; ie */4 is every 4 days, and 1-5/2 is every 2 days between mon and fri.',
    };

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get min() {
        let valueArray = this.value ? this.value.split('::') : [];
        return valueArray[0] || '';
    }

    set min(v) {
        this.value = `${v}::${this.hrs}::${this.date}::${this.mo}::${this.day}`;
    }

    get hrs() {
        let valueArray = this.value ? this.value.split('::') : [];
        return valueArray[1] || '';
    }

    set hrs(v) {
        this.value = `${this.min}::${v}::${this.date}::${this.mo}::${this.day}`;
    }

    get date() {
        let valueArray = this.value ? this.value.split('::') : [];
        return valueArray[2] || '';
    }

    set date(v) {
        this.value = `${this.min}::${this.hrs}::${v}::${this.mo}::${this.day}`;
    }

    get mo() {
        let valueArray = this.value ? this.value.split('::') : [];
        return valueArray[3] || '';
    }

    set mo(v) {
        this.value = `${this.min}::${this.hrs}::${this.date}::${v}::${this.day}`;
    }

    get day() {
        let valueArray = this.value ? this.value.split('::') : [];
        return valueArray[4] || '';
    }

    set day(v) {
        this.value = `${this.min}::${this.hrs}::${this.date}::${this.mo}::${v}`;
    }

}
