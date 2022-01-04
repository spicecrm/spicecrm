/**
 * @module SystemComponents
 */
import {
    Component, Pipe
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'package-loader',
    templateUrl: '../templates/packageloader.html',
})
export class PackageLoader {

    public scope: string = 'essentials';
    public loading: boolean = true;
    public packagefilterterm: string = '';

    public repositories = [];
    public repository: any;
    public packages = [];
    public versions = [];
    public languages = [];
    public opencrs: boolean = false;
    public errorpackages: string[] = [];

    constructor(
        public language: language,
        public backend: backend,
        public toast: toast,
        public metadata: metadata
    ) {

        this.backend.getRequest('configuration/packages/repositories').subscribe(
            (res) => {
                this.loading = false;
                this.repositories = res;

                if (this.repositories.length == 0) {
                    this.repository = 'default';
                    this.loadpackages();
                } else if (this.repositories.length == 1) {
                    this.repository = this.repositories[0];
                    this.loadpackages();
                }
            },
            (err) => {
                this.loading = false;
            },
        );
    }


    get errorpackagesdisplay() {
        return this.errorpackages.join(', ');
    }

    set repositoryname(value) {
        this.repository.name = value;
    }

    get repositoryname() {
        return this.repository && this.repository.name ? this.repository.name : '';
    }
    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    public loadpackages() {
        this.loading = true;

        this.packages = [];
        this.languages = [];
        this.opencrs = false;
        this.errorpackages = [];

        this.backend.getRequest('configuration/packages' + this.repositoryaddurl).subscribe(
            (res) => {
                this.loading = false;
                try {
                    let availableLanguages = this.language.getAvialableLanguages(true);
                    for (let langpack of res.languages) {
                        availableLanguages.some(thislanguage => {
                            if (thislanguage.language == langpack.language_code) {
                                langpack.installed = true;
                                return true;
                            }
                        })
                        this.languages.push(langpack);
                    }

                    for (let confpackage of res.packages) {
                        let instIndex = res.loaded.packages.indexOf(confpackage.package);
                        if (instIndex >= 0) {
                            confpackage.installed = true;
                            res.loaded.packages.splice(instIndex, 1);
                        } else {
                            confpackage.installed = false;
                        }
                        this.packages.push(confpackage);
                    }
                    this.versions = res.versions;
                    this.opencrs = res.opencrs;

                    // write the erroneous packages
                    this.errorpackages = res.loaded.packages;

                } catch (e) {
                    console.error(e);
                }
            },
            (err) => {
                this.loading = false;
            },
        );
    }

    public selectRepository(repository) {
        this.repository = repository;
        this.loadpackages();
    }


}
