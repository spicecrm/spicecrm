/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";
import {indexOf} from "underscore";
import {loader} from "../../../services/loader.service";

@Component({
    selector: 'systemtenant-header-bar',
    templateUrl: '../templates/systemtenantheaderbar.html'
})
export class SystemTenantHeaderBar {


    public loadTasks: boolean = false;

    private loadermodal: any;

    constructor(
        public metadata: metadata,
        public modal: modal,
        public backend: backend,
        public loader: loader
    ) {
        this.getPackages();
    }

    private getPackages(){
        this.backend.getRequest('configuration/packages').subscribe({
            next: (p) => {
                if(indexOf(p.loaded.packages, 'core') < 0){
                    let am = this.modal.await('LBL_PREPARING_YOUR_EXPERIENCE');
                    this.backend.getRequest('configuration/packages/package/core').subscribe({
                        next: (loaded) => {
                            am.emit(true);
                            this.loadTasks = true;
                            this.modal.openModal('GlobalHeaderReloadModal', false).subscribe(modalref => {
                                this.loadermodal = modalref;
                            })
                            this.loader.load().subscribe((val) => {
                                if (val === true) {
                                    this.loadTasks = false;
                                    this.loadermodal.instance.self.destroy();
                                    this.openWelcome();
                                } else {
                                    this.loadTasks = false;
                                    this.loadermodal.instance.self.destroy();
                                }
                            });
                        },
                        error: () => {
                            am.emit(true);
                        }
                    })
                } else {
                    this.openWelcome();
                }
            }
        })
    }

    public openWelcome(){
        this.modal.openModal('SystemTenantWelcomeModal');
    }
}
