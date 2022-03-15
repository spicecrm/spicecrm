/**
 * @module GlobalComponents
 */
import {Component, ViewContainerRef, ViewChild, AfterViewInit} from '@angular/core';
import {toast} from '../../services/toast.service';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'global-footer',
    templateUrl: '../templates/globalfooter.html'
})
export class GlobalFooter implements AfterViewInit {

    @ViewChild('footercontainer', {read: ViewContainerRef, static: true})public footercontainer: ViewContainerRef;
    @ViewChild('modalcontainer', {read: ViewContainerRef, static: true})public modalcontainer: ViewContainerRef;
    @ViewChild('modalbackdrop', {read: ViewContainerRef, static: true})public modalbackdrop: ViewContainerRef;

    constructor(public session: session,public footer: footer,public modalservice: modal) {
    }

    public ngAfterViewInit() {
        this.footer.footercontainer = this.footercontainer;
        this.footer.modalcontainer = this.modalcontainer;
        this.footer.modalbackdrop = this.modalbackdrop;
    }
}
