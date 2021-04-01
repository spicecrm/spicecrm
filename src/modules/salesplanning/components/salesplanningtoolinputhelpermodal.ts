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
 * @module ModuleSalesPlanning
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolinputhelpermodal.html'
})

export class SalesPlanningToolInputHelperModal {

    public self: any = {};
    public allFields: any[] = [];
    public periods: any[] = [];
    public data: any = {startPeriod: 0, fromField: 'fixed'};
    public response: Observable<any>;
    public responseSubject: Subject<any> = new Subject<object>();

    constructor(private language: language) {
        this.response = this.responseSubject.asObservable();
    }

    /*
    * @set endPeriod = last period
    */
    public ngOnInit() {
        this.data.endPeriod = this.periods.length -1;
    }

    get editableFields() {
        return this.allFields.filter(field => field.editable == '1');
    }

    /*
    * @return all fields except toField
    */
    get allAvailableFields() {
        return this.allFields.filter(field => field.id != this.data.toField);
    }

    /*
    * @next responseSubject: boolean = false
    * @complete responseSubject
    * @destroy self
    */
    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    /*
    * @next responseSubject: any = data
    * @complete responseSubject
    * @destroy self
    */
    private execute() {
        this.responseSubject.next(this.data);
        this.responseSubject.complete();
        this.self.destroy();
    }
}
