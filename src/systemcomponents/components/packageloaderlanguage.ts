/**
 * @module SystemComponents
 */
import {
    Component, Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {loader} from '../../services/loader.service';
import {broadcast} from '../../services/broadcast.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'package-loader-language',
    templateUrl: '../templates/packageloaderlanguage.html',
})
export class PackageLoaderLanguage {

    @Input() public package: any;
    @Input() public repository: any;

    public loading: boolean = false;

    constructor(
        public language: language,
        public backend: backend,
        public configurationService: configurationService,
        public loader: loader,
        public broadcast: broadcast
    ) {

    }

    get isDefault() {
        return this.package.language_code == this.language.getDefaultLanguage();
    }

    get deletedisabled() {
        return this.isDefault || this.package.language_code == this.language.currentlanguage;
    }
    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    public setDefault() {
        if (!this.isDefault) {
            this.language.setDefaultLanguage(this.package.language_code);
        }
    }

    public loadLanguage(languagecode) {

        this.loading = true;
        this.backend.getRequest('configuration/packages/language/' + languagecode + this.repositoryaddurl).subscribe(response => {
            this.loading = false;
            if (response.success) {
                this.package.installed = true;
                this.language.addAvailableLanguage(response.languages[languagecode]);
                if (this.language.currentlanguage == languagecode) {
                    this.language.loadLanguage().subscribe((loaded) => {
                        this.package.installed = true;
                    });
                } else {
                    this.package.installed = true;
                }
            }
        });
    }

    public deleteLanguage(languagecode) {

        this.loading = true;
        this.backend.deleteRequest('configuration/packages/language/' + languagecode).subscribe(response => {
            this.loading = false;
            if (response) {
                this.package.installed = false;
                this.language.removeAvailableLanguage(languagecode);
            }
        });
    }
}
