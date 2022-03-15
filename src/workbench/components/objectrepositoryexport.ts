/**
 * @module WorkbenchModule
 */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'objectrepositoryexport',
    templateUrl: '../templates/objectrepositoryexport.html',
})
export class ObjectRepositoryExport {

    public self;
    public isLoading = false;
    public repostring: string;
    @ViewChild('inputField', {static: true}) public inputField: ElementRef;

    constructor( public lang: language, public backend: backend, public toast: toast ) { }

    public ngOnInit() {
        this.isLoading = true;
        this.backend.getRequest( 'configuration/configurator/objectrepository' ).subscribe( response => {
            this.repostring = response.repostring;
            this.isLoading = false;
            window.setTimeout( () => this.inputField.nativeElement.select(), 500 );
        }, () => {
            this.isLoading = false;
            this.toast.sendToast('Error loading data!', 'error');
        });
    }

    /*
    // Does not work:
    public copyToClipboard() {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = selBox.style.top = selBox.style.opacity = '0';
        selBox.value = this.repostring;
        document.body.appendChild( selBox );
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild( selBox );
        this.isLoading = false;
        this.toast.sendToast('Content of object repository copied to clipboard.', 'success');
    }
    */

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

}
