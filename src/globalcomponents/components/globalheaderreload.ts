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
import {ɵResourceLoaderImpl} from "@angular/platform-browser-dynamic";

@Component({
    selector: 'global-header-reload',
    templateUrl: './src/globalcomponents/templates/globalheaderreload.html'
})
export class GlobalHeaderReload {

    private loadTasks: boolean = false;

    constructor( private session: session,
                 private router: Router,
                 private language: language,
                 private loader: loader,
                 private configuration: configurationService,
                 private toast: toast,) {

    }

    private isAdmin() {
        return this.session.isAdmin;
    }

    private reloadConf() {
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