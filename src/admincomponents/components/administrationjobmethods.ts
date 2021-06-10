/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    selector: 'administration-job-methods',
    templateUrl: './src/admincomponents/templates/administrationjobmethods.html'
})
export class AdministrationJobMethods implements OnInit {

    private jobsList: any[] = [];
    private _job: string;
    public subscription = new Subscription();

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public backend: backend) {
        this.backend.getRequest('module/Jobs/jobslist').subscribe(data => {
            for ( let prop in data ) this.jobsList.push({ key: prop, name: data[prop] });
            this.language.sortObjects( this.jobsList, 'name' );
        });

    }

    public ngOnInit(): void {
        this.subscription.add(
            this.model.data$.subscribe( data => this.splitJob() )
        );
        if ( !this.model.isLoading ) this.splitJob();
    }

    private splitJob() {
        this._job = this.model.getField('job');
    }

    private trackByFn(index, item) {
        return index;
    }

    get job(): string {
        return this._job;
    }

    set job( value ) {
        this.model.setField('method', value);
    }
}
