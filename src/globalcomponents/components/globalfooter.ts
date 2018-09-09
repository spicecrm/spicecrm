import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { toast } from '../../services/toast.service';
import { session } from '../../services/session.service';
import { footer } from '../../services/footer.service';
import { language } from '../../services/language.service';
import { modal } from '../../services/modal.service';

@Component({
    selector: 'global-footer',
    templateUrl: './src/globalcomponents/templates/globalfooter.html'
})
export class GlobalFooter implements AfterViewInit {

    @ViewChild( 'footercontainer', { read: ViewContainerRef }) footercontainer: ViewContainerRef;
    @ViewChild( 'modalcontainer', { read: ViewContainerRef }) modalcontainer: ViewContainerRef;
    @ViewChild( 'modalbackdrop', { read: ViewContainerRef }) modalbackdrop: ViewContainerRef;

    constructor( private session: session, private footer: footer, private modalservice: modal ) { }

    ngAfterViewInit(){
        this.footer.footercontainer = this.footercontainer;
        this.footer.modalcontainer = this.modalcontainer;
        this.footer.modalbackdrop = this.modalbackdrop;
    }

}