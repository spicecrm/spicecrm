import { Component, Inject, Input } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { language } from '../../services/language.service';
import { DOCUMENT } from "@angular/common";

@Component({
    selector: 'objectrepositoryexport',
    templateUrl: './src/workbench/templates/objectrepositoryexport.html',
})
export class ObjectRepositoryExport {

    private self;
    private isLoading = false;
    private repostring: string;

    constructor( @Inject(DOCUMENT) private _document: any, private lang: language, private backend: backend, private toast: toast ) { }

    private export() {
        this.isLoading = true;
        this.backend.getRequest( 'configurator/objectrepository' ).subscribe( response => {
            this.repostring = response.repostring;
            this.isLoading = false;
            this.copyToClipboard();
        }, () => {
            this.isLoading = false;
            this.toast.sendToast('Error loading data!', 'error');
        });
    }

    private copyToClipboard() {

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

    // Close the modal.
    private closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

}
