import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    NgModule,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Renderer,
    EventEmitter,
    HostListener
} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {GlobalAppLauncherDialog} from "./globalapplauncherdialog";


@Component({
    selector: 'global-app-launcher',
    templateUrl: './app/globalcomponents/templates/globalapplauncher.html',
    host: {
        'class': 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncher {

    constructor(private metadata: metadata, private modal: modal, private language: language, private router: Router, private broadcast: broadcast) {

    }

    getRoleName() {
        let role = this.metadata.getActiveRole();
        if (role.label && role.label != '')
            return this.language.getLabel(role.label)
        else
            return this.metadata.getActiveRole().name;
    }


    showAppLauncher() {
        this.modal.openModal('GlobalAppLauncherDialog');
    }
}