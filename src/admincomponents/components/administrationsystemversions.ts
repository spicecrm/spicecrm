/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {helper} from '../../services/helper.service';

@Component({
    templateUrl: '../templates/administrationsystemversions.html'
})
export class AdministrationSystemVersions {

    /**
     * defines if the stats have been loaded
     *
     * otherwise a spinner is rendered for the user
     */
    public loaded: boolean = false;

    /**
     * holds the stats
     */
    public versions: any = {};

    public vendorpackages: any[] = [];

    constructor(
        public http: HttpClient,
        public language: language,
        public backend: backend
    ) {
        this.loadVersions();
    }

    /**
     * loads the stats from the backend
     */
    public loadVersions() {
        this.loaded = false;
        this.http.get('config/systemdetails/').subscribe(
            (data: any) => {
                this.versions = data;
                this.vendorpackages = [];
                for (let vendorpackage in this.versions.vendor) {
                    this.vendorpackages.push({
                        vendorpackage: vendorpackage,
                        files: this.versions.vendor[vendorpackage]
                    });
                }
                this.loaded = true;
            });
    }

}
