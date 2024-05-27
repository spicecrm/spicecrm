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
import {modal} from "../../services/modal.service";
import {
    DictionaryManagerFixDBFieldsMismatchModal
} from "../../workbench/components/dictionarymanagerfixdbfieldsmismatchmodal";
import {toast} from "../../services/toast.service";

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'package-loader-package',
    templateUrl: '../templates/packageloaderpackage.html',
})
export class PackageLoaderPackage implements OnInit {

    @Input() public package: any;
    @Input() public packages: any[] = [];
    @Input() public repository: any;
    public extensions: any[] = [];
    public requiredpackages: any[] = [];
    // public disabled: boolean = true;
    public loading: string = '';

    constructor(
        public language: language,
        public backend: backend,
        public configurationService: configurationService,
        public loader: loader,
        public modal: modal,
        public broadcast: broadcast,
        private toast: toast
    ) {

    }

    get disabled() {
        // if the package is installed we show it as enabled ... so it can at least be unlaoded
        if (this.package.package.installed) return false;

        // if package is not installed check for prerequsites
        let disabled = false;
        this.extensions.forEach(extension => {
            if (!extension.status) disabled = true;
        });
        this.requiredpackages.forEach(pkg => {
            if (!pkg.installed) disabled = true;
        });

        return disabled;
    }

    get repositoryaddurl() {
        return this.repository && this.repository.id ? '/' + this.repository.id : '';
    }

    public ngOnInit() {
        let disabled = false;
        if (this.package.extensions) {
            for (let extension of this.package.extensions.split(',')) {
                let extensionstatus = this.configurationService.checkCapability(extension);
                this.extensions.push({
                    name: extension,
                    status: extensionstatus
                });
            }
        }
        if (this.package.packages) {
            this.requiredpackages = this.packages.filter(pkg => this.package.packages.split(',').indexOf(pkg.package) >= 0);
        }
    }

    public loadPackage(pkg) {
        this.loading = 'package';
        this.backend.getRequest('configuration/packages/package/' + pkg.package + this.repositoryaddurl).subscribe({
            next: res => {
                this.loading = 'configuration';
                this.loader.load().subscribe(status => {
                    this.package.installed = true;
                    this.broadcast.broadcastMessage('loader.reloaded');
                    this.loading = '';
                });

                this.toast.sendToast('LBL_DONE', 'success');

            },
            error: err => {
                pkg.erroneousDictionaries = err.error?.error?.details?.filter(e => e.scope == 'dictionary' && e.mismatch) ?? [];
                this.toast.sendToast(err.error?.error?.message ?? 'unknown error', 'error');

                if (pkg.erroneousDictionaries?.length > 0) {
                    this.openFixRequiredModal(pkg);
                }
                this.loading = '';
            }
        });
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
                    this.loadPackage(pkg);
                }
            })
        });
    }

    public deletePackage(packagename) {
        this.loading = 'package';
        this.backend.deleteRequest('configuration/packages/package/' + packagename).subscribe(response => {
            this.loading = 'configuration';
            this.package.installed = false;
            this.loader.load().subscribe(status => {
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = '';
            });
        });
    }
}
