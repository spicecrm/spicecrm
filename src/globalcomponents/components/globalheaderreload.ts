/**
 * @module GlobalComponents
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {loader} from '../../services/loader.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'global-header-reload',
    templateUrl: '../templates/globalheaderreload.html'
})
export class GlobalHeaderReload {

   public loadTasks: boolean = false;

    constructor(public session: session,
                public router: Router,
                public language: language,
                public loader: loader,
                public configuration: configurationService,
                public toast: toast,) {

    }

   public isAdmin() {
        return this.session.isAdmin;
    }

   public reloadConf() {
        this.loadTasks = true;
        this.loader.load().subscribe((val) => {
            if (val === true) {
                this.toast.sendToast(this.language.getLabel("LBL_DATA_RELOADED") + ".", "success");
                this.loadTasks = false;
            } else {
                this.toast.sendToast('error', 'error', 'Reload failed');
                this.loadTasks = false;
            }
        });
    }
}
