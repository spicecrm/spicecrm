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
    templateUrl: './src/workbench/templates/packageloaderpackage.html',
})
export class PackageLoaderPackage implements OnInit {

    @Input() private package: any;
    private extensions: any[] = [];
    private disabled: boolean = true;
    private loading: string = '';

    constructor(
        private language: language,
        protected backend: backend,
        private configurationService: configurationService,
        private loader: loader,
        private broadcast: broadcast
    ) {

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

                if (!extensionstatus) disabled = true;
            }
        }
        this.disabled = disabled;
    }

    private loadPackage(packagename) {
        this.loading = 'package';
        this.backend.getRequest('/packages/package/' + packagename).subscribe(response => {
            this.loading = 'configuration';
            this.loader.reloadPrimary().subscribe(status => {
                this.package.installed = true;
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = '';
            });
        });
    }

    private deletePackage(packagename) {
        this.loading = 'package';
        this.backend.deleteRequest('/packages/package/' + packagename).subscribe(response => {
            this.loading = 'configuration';
            this.loader.reloadPrimary().subscribe(status => {
                this.package.installed = false;
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = '';
            });
        });
    }


}
