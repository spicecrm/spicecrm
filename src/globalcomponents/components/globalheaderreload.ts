/**
 * @module GlobalComponents
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {modal} from '../../services/modal.service';
import {loader} from '../../services/loader.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'global-header-reload',
    templateUrl: '../templates/globalheaderreload.html'
})
export class GlobalHeaderReload {

   public loadTasks: boolean = false;

   private loadermodal: any;

    constructor(public session: session,
                public router: Router,
                public loader: loader,
                public modal: modal,
                public configuration: configurationService,
                public toast: toast,) {

    }

   public isAdmin() {
        return this.session.isAdmin;
    }

   public reloadConf() {
        this.loadTasks = true;
        this.modal.openModal('GlobalHeaderReloadModal', false).subscribe(modalref => {
            this.loadermodal = modalref;
        })
        this.loader.load().subscribe((val) => {
            if (val === true) {
                this.toast.sendToast("LBL_DATA_RELOADED");
                this.loadTasks = false;
                this.loadermodal.instance.self.destroy();
            } else {
                this.toast.sendToast('error', 'error', 'Reload failed');
                this.loadTasks = false;
                this.loadermodal.instance.self.destroy();
            }
        });
    }
}
