import {
    Component, Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {toast} from '../../services/toast.service';
import {loader} from '../../services/loader.service';
import {broadcast} from '../../services/broadcast.service';

declare var _;

@Component({
    selector: 'package-loader-package',
    templateUrl: './src/systemcomponents/templates/packageloaderpackage.html',
})
export class PackageLoaderPackage implements OnInit {

    @Input() private package: any;
    @Input() private packages: any[] = [];
    private extensions: any[] = [];
    private requiredpackages: any[] = [];
    // private disabled: boolean = true;
    private loading: string = '';

    constructor(
        private language: language,
        protected backend: backend,
        private configurationService: configurationService,
        private loader: loader,
        private broadcast: broadcast
    ) {

    }

    get disabled() {
        let disabled = false;

        this.extensions.forEach(extension => {
            if (!extension.status) disabled = true;
        });

        this.requiredpackages.forEach(pkg => {
            if (!pkg.installed) disabled = true;
        });

        return disabled;
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

    private loadPackage(packagename) {
        this.loading = 'package';
        this.backend.getRequest('/packages/package/' + packagename).subscribe(
            response => {
                this.loading = 'configuration';
                this.loader.reloadPrimary().subscribe(status => {
                    this.package.installed = true;
                    this.broadcast.broadcastMessage('loader.reloaded');
                    this.loading = '';
                });
            },
            error => {
                this.loading = '';
            });
    }

    private deletePackage(packagename) {
        this.loading = 'package';
        this.backend.deleteRequest('/packages/package/' + packagename).subscribe(response => {
            this.loading = 'configuration';
            this.package.installed = false;
            this.loader.reloadPrimary().subscribe(status => {
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = '';
            });
        });
    }
}
