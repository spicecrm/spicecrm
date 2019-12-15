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
