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
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {Router} from "@angular/router";

@Component({
    selector: 'administration-scheduler-jobs-enum',
    templateUrl: './src/admincomponents/templates/administrationschedulerjobsenum.html'
})
export class AdministrationSchedulerJobsEnum implements OnInit {

    private jobsList: any[] = [];
    private _job: string;
    private _url: string;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public backend: backend) {
        this.backend.getRequest('module/Schedulers/jobslist').subscribe(data => {
            for ( let prop in data ) this.jobsList.push({ key: prop, name: data[prop] });
            this.language.sortObjects( this.jobsList, 'name' );
        });

    }

    public ngOnInit(): void {
        this.model.data$.subscribe( data => this.splitJob() );
        if ( !this.model.isLoading ) this.splitJob();
    }

    private splitJob() {
        let job = this.model.getField( 'job' );
        if ( job && job.indexOf( 'url::', 0 ) === 0 ) {
            this._job = 'url::';
            this._url = job.slice( 5 );
        } else {
            this._job = job;
            this._url = '';
        }
    }

    private trackByFn(index, item) {
        return index;
    }

    get job(): string {
        return this._job;
    }

    set job( value ) {
        this.model.setField('job', value + ( value === 'url::' ? this._url:'' ));
    }

    get url(): string {
        return this._url;
    }

    set url( value ) {
        if ( this._job ===  'url::' ) {
            this.model.setField('job', 'url::'+ value );
        }
    }

}
