import {
    EventEmitter, Output,
} from '@angular/core';
import {backend} from '../../services/backend.service';


export class BasicReferenceForm
{
    protected package_names = [];
    protected version_names = [];
    protected is_pulling = false;
    protected is_loading_availabilities = true;
    protected pull_result: string;
    @Output('load') protected load$ = new EventEmitter();
    protected available_packages = [];
    protected available_versions = [];
    protected available_languages = [];

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