import {
    EventEmitter, Output,
} from '@angular/core';
import {backend} from '../../services/backend.service';


export class BasicReferenceForm
{
    package_names = [];
    version_names = [];
    is_pulling = false;
    is_loading_availabilities = true;
    pull_result:string;
    @Output('load') load$ = new EventEmitter();
    available_packages = [];
    available_versions = [];
    available_languages = [];

    constructor(
        protected backend: backend,
    ){
        this.backend.getRequest('/reference').subscribe(
            (res) => {
                this.is_loading_availabilities = false;
                try {
                    this.available_languages = res.languages;
                    this.available_packages = res.packages;
                    this.available_versions = res.versions;
                    //console.log(res, this.available_versions);
                }
                catch(e){
                    console.error(e);
                }
            },
            (err) => {
                this.is_loading_availabilities = false;
                console.log(err);
            },
        );
    }
}