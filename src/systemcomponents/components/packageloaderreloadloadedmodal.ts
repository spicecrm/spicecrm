import {Component, ComponentRef, Input} from '@angular/core';
import {backend} from "../../services/backend.service";
import {loader} from "../../services/loader.service";
import {broadcast} from "../../services/broadcast.service";
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {modal} from "../../services/modal.service";
import {
    DictionaryManagerFixDBFieldsMismatchModal
} from "../../workbench/components/dictionarymanagerfixdbfieldsmismatchmodal";
import {language} from "../../services/language.service";

@Component({
    selector: 'package-loader-reload-loaded-modal',
    templateUrl: '../templates/packageloaderreloadloadedmodal.html'
})

export class PackageLoaderReloadLoadedModal implements ModalComponentI {
    /**
     * holds the loaded packages
     */
    @Input() public packages: {
        name: string;
        package: string;
        type: 'essentials' | 'config' | 'content';
        status?: 'reloaded' | 'error' | 'processing' | 'success';
        erroneousDictionaries?: {name: string; mismatch: any}[];
        message?: {text?: string; details: string};
    }[] = [];
    /**
     * holds the loaded languages
     */
    @Input() public languages: {
        language_code: string;
        language_name: string;
        status?: 'reloaded' | 'error' | 'processing' | 'success';
        message?: string;
    }[] = [];
    /**
     * holds the repository add url
     */
    @Input() public repositoryAddUrl: string;
    /**
     * is reloading flag
     */
    public isReloadingPackage: boolean = false;
    /**
     * is reloading config flag
     */
    public isReloadingConfig: boolean = false;
/**
     * started flag
     */
    public started: boolean = false;
    /**
     * progress bar value
     */
    public progress: number = 0;
    /**
     * reloaded packages count bar value
     */
    public reloadedCount: number = 0;

    @Input() public self: ComponentRef<PackageLoaderReloadLoadedModal>;

    constructor(private backend: backend,
                private broadcast: broadcast,
                private modal: modal,
                private language: language,
                private loader: loader) {
    }

    /**
     * update progress value
     * @private
     */
    private updateProgressValue() {
        this.reloadedCount = this.packages.filter(d => !!d.status).length + this.languages.filter(d => !!d.status).length;
        const count = (this.languages.length + this.packages.length);
        this.progress = Math.round(((count - (count - this.reloadedCount)) / count) * 100);
    }

    /**
     * reload all loaded package
     */
    public reloadAll() {

        this.packages.forEach(pkg => {
            pkg.status = undefined;
            pkg.message = undefined;
        });

        this.languages.forEach(pkg => {
            pkg.status = undefined;
            pkg.message = undefined;
        });

        this.started = true;
        this.reloadedCount = 0;
        this.progress = 0;

        this.reloadNext();
    }

    /**
     * reload next package
     * @private
     */
    private reloadNext() {

        const lang = this.languages.find(p => !p.status);
        const pkg = this.packages.find(p => !p.status);

        if ((!pkg && !lang) || !this.started) {
            return this.handleReloadComplete();
        }

        const reloadFunction = () => lang ? this.reloadLanguage(lang) : this.reloadPackage(pkg);

        reloadFunction().then(() => {
            this.updateProgressValue();
            this.reloadNext();
        });
    }

    /**
     * reload given package and return Promise
     * @param pkg
     * @private
     */
    public reloadPackage(pkg): Promise<boolean> {

        this.isReloadingPackage = true;
        pkg.status = 'processing';

        return new Promise(resNext => {
            this.backend.getRequest(`configuration/packages/package/${pkg.package}${this.repositoryAddUrl}`).subscribe({
                next: res => {
                    pkg.status = 'reloaded';
                    pkg.message = {
                        text: res.response.queries + ' rows',
                        details: Object.keys(res.response.tables).map(k => `${k}: ${res.response.tables[k]}`).join("\n")
                    };
                    this.isReloadingPackage = false;

                    resNext(true);
                },
                error: err => {
                    pkg.status = 'error';
                    pkg.erroneousDictionaries = err.error?.error?.details?.filter(e => e.scope == 'dictionary') ?? [];
                    pkg.message = {text: err.error?.error?.message ?? 'unknown error', details: err.error?.error?.details};
                    this.isReloadingPackage = false;

                    resNext(true);
                }
            });

        });
    }

    /**
     * reload language
     * @param lang
     */
    public reloadLanguage(lang): Promise<boolean> {

        this.isReloadingPackage = true;
        lang.status = 'processing';

        return new Promise(resNext => {
            this.backend.getRequest(`configuration/packages/language/${lang.language_code}${this.repositoryAddUrl}`).subscribe({
                next: res => {
                    lang.status = 'reloaded';
                    this.isReloadingPackage = false;

                    lang.message = res.queries + ' rows';

                    if (this.language.currentlanguage == lang.language_code) {
                        this.language.loadLanguage();
                    }

                    resNext(true);
                },
                error: () => {
                    lang.status = 'error';
                    resNext(true);
                }
            });
        });
    }

    /**
     * handle reload complete to reload the config from backend
     * @private
     */
    private handleReloadComplete() {
        this.isReloadingPackage = false;
        this.started = false;

        if (!this.packages.some(p => p.status == 'reloaded') && !this.languages.some(p => p.status == 'reloaded')) return;

        this.isReloadingConfig = true;

        this.loader.load().subscribe(() => {
            this.broadcast.broadcastMessage('loader.reloaded');
            this.isReloadingConfig = false;
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * set the stop flag
     */
    public stop() {
        this.started = false;
    }

    /**
     * angular trackBy Function definition
     * @param item
     */
    public trackByFn(item) {
        return item.name;
    }

    /**
     * show response details for package
     * @param pkg
     */
    public showResponseDetails(pkg) {
        this.modal.info(pkg.message.details.map(d => d.message).join("\n"), pkg.name);
    }

    /**
     * open fix required modal
     * @param pkg
     */
    public openFixRequiredModal(pkg) {
        this.modal.openStaticModal(DictionaryManagerFixDBFieldsMismatchModal).subscribe(modalRef => {
            modalRef.instance.dictionaries = pkg.erroneousDictionaries.map(d => d.name);
            modalRef.instance.dictionaryName = modalRef.instance.dictionaries[0];
            pkg.erroneousDictionaries.forEach(d => {
                modalRef.instance.mismatch[d.name] = d.mismatch[d.name];
            });
            modalRef.instance.response.subscribe({
                next: success => {
                    if (!success) return;
                    this.reloadPackage(pkg);
                }
            })
        });
    }

}