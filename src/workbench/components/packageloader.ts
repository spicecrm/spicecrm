import {
    Component, Pipe
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {BasicReferenceForm} from "./basicreferenceform";
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {spiceprocess} from "../../addcomponents/services/spiceprocess";

declare var _;

@Pipe({name: 'packageloaderpipe'})
export class PackageLoaderPipe {
    public transform(packagelist, term) {
        // if we do not have a searchterm do not apply the filter
        if (!term) return packagelist;

        let retValues = [];
        for (let packageitem of packagelist) {
            if (packageitem.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) retValues.push(packageitem);
        }
        return retValues;
    }
}

@Component({
    selector: 'package-loader',
    templateUrl: './src/workbench/templates/packageloader.html',
})
export class PackageLoader {

    private scope: string = 'packages';
    private loading: boolean = true;
    private packagefilterterm: string = '';

    protected packages = [];
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
                        confpackage.installed = res.loaded.packages.indexOf(confpackage.package) >= 0 ? true : false;
                        this.packages.push(confpackage);

                        res.loaded.packages.splice(res.loaded.packages.indexOf(confpackage.package), 1);
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
