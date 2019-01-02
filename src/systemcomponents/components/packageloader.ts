import {
    Component, Pipe
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {spiceprocess} from "../../addcomponents/services/spiceprocess";

declare var _;

@Component({
    selector: 'package-loader',
    templateUrl: './src/systemcomponents/templates/packageloader.html',
})
export class PackageLoader {

    private scope: string = 'packages';
    private loading: boolean = true;
    private packagefilterterm: string = '';

    protected configpackages = [];
    protected contentpackages = [];
    protected versions = [];
    protected languages = [];
    protected opencrs: boolean = false;
    protected errorpackages: string[] = [];

    constructor(
        private language: language,
        protected backend: backend,
        private toast: toast,
        private metadata: metadata
    ) {

        this.backend.getRequest('/packages').subscribe(
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
                        if(confpackage.type=='config') {
                            confpackage.installed = res.loaded.packages.indexOf(confpackage.package) >= 0 ? true : false;
                            this.configpackages.push(confpackage);

                            res.loaded.packages.splice(res.loaded.packages.indexOf(confpackage.package), 1);
                        } else {
                            this.contentpackages.push(confpackage);
                        }
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

    get errorpackagesdisplay() {
        return this.errorpackages.join(', ');
    }

}
