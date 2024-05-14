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
import {modal} from "../../services/modal.service";
import {PackageLoaderReloadLoadedModal} from "./packageloaderreloadloadedmodal";
import {error} from "@angular/compiler-cli/src/transformers/util";

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
        public metadata: metadata,
        private modal: modal
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

    /**
     * system package visible flag
     */
    get systemPackageVisible() {
        return this.metadata.configuration.getCapabilityConfig('adminpackages')?.system_package_visible;
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

    /**
     * reload loaded packages
     */
    public reloadLoadedPackages() {

        this.modal.openStaticModal(PackageLoaderReloadLoadedModal).subscribe(ref => {
            ref.instance.packages = this.packages.filter(p => p.installed && p.type != 'content').map(p => ({...p})).sort((a, b) => a.package == 'core' ? -1 : a.package.localeCompare(b.package));
            ref.instance.repositoryAddUrl = this.repositoryaddurl;
        });
    }

    /**
     * reload system package
     */
    public reloadSystemPackage() {
        this.modal.confirm('MSG_RELOAD_SYSTEM_PACKAGE', 'MSG_RELOAD_SYSTEM_PACKAGE').subscribe(answer => {

            if (!answer) return;

            const loading = this.modal.await('LBL_LOADING')
            this.backend.getRequest('configuration/package/system').subscribe({
                next: () => {
                    loading.next(true);
                    loading.complete();
                    this.toast.sendToast('LBL_DATA_RELOADED', 'success');
                },
                error: () => {
                    loading.next(true);
                    loading.complete();
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            });
        });
    }
}
