/**
 * @module WorkbenchModule
 */
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { backend } from '../../services/backend.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/configtransfer.html'
})
export class ConfigTransfer {

    private tabToShow = 'i'; // i...import, e...export

    // EXPORT:

    private selectableTables: any[] = [];
    private blacklistedTables: string[] = [];
    private additionalTables = '';
    private tablenamesLoaded = false;
    private showBlacklistedTables = false;
    private isLoadingTablenames = false;
    private isDownloading = false;
    private exportErrorID: string;
    private exportErrorMessage: string;
    @ViewChild( 'downloadlink', {read: ViewContainerRef, static: true } ) private downloadlink: ViewContainerRef;
    private loadUrl: any = undefined;
    private fileName: string = 'export.gz';
    private changeExportSettings = false;

    // IMPORT:

    private fileFromBrowser: File;
    private uploadProgress: number;
    private isUploading = false;
    private isImporting = false;
    private isAfterUpload = false;
    private dropErrorMessageCode: string = null;
    private importOK: boolean = null;
    private importResponse: any;
    private importErrorMessage: string;
    private importErrorID: string;
    private ignoreUnknownTables = false;
    @ViewChild('fileupload', {read: ViewContainerRef, static: true}) private fileupload: ViewContainerRef;
    private isDragOver = false;

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast ) { }

    private showExport() {
        if ( this.tabToShow === 'e' ) return;
        if( !this.tablenamesLoaded && !this.isLoadingTablenames ) {
            this.isLoadingTablenames = true;
            this.backend.getRequest( 'configuration/transfer/tablenames' ).subscribe( ( response: any ) => {
                response.selectableTables.forEach( ( tablename ) => {
                    this.selectableTables.push( { name: tablename, include: true } );
                } );
                response.blacklistedTables.forEach( ( tablename ) => {
                    this.blacklistedTables.push( tablename );
                } );
                this.isLoadingTablenames = false;
                this.tablenamesLoaded = true;
            } );
        }
        this.tabToShow = 'e';
    }

    private showImport() {
        this.tabToShow = 'i';
    }

    private exportTables() {
        this.isDownloading = true;
        if ( this.exportErrorID ) {
            this.toast.clearToast( this.exportErrorID );
            this.exportErrorID = null;
        }
        let selectedTables: string[] = [];
        this.selectableTables.forEach( ( table => {
            if ( table.include ) selectedTables.push(table.name);
        }));
        this.fileName = 'spicecrm-cfg-' + moment().format('YYYYMMDD-HHmm') + '.gz';
        this.backend.getDownloadPostRequestFile('configuration/transfer/export', {}, { selectedTables: selectedTables, additionalTables: this.additionalTables } ).subscribe(
            url => {
                this.downloadlink.element.nativeElement.href = url;
                this.downloadlink.element.nativeElement.click();
                this.isDownloading = false;
            },
            err => {
                this.isDownloading = false;
                this.exportErrorID = this.toast.sendToast( this.lang.getLabel('ERR_EXPORT_FAILED'), 'error', this.exportErrorMessage = err.error.message );
            }
        );
    }

    private selectAll( status: boolean ) {
        this.selectableTables.forEach( table => {
            table.include = status;
        });
    }

    private get numberOfSelectedTables() {
        let number = 0;
        this.selectableTables.forEach( table => table.include && number++ );
        return number;
    }

    private uploadFile() {
        this.modalservice.confirm('You are about to upload a file and import its data into the database. This will change the existing database. Do you really want to do this?', this.lang.getLabel('LBL_WARNING'), 'warning').subscribe(
            answer => {
                if ( answer ) {
                    this.isUploading = true;
                    this.importOK = null;
                    let progress = new BehaviorSubject<number>(0);
                    progress.subscribe( value => {
                        this.uploadProgress = value;
                        if ( value === 100 ) this.isImporting = true;
                    });
                    this.readFileFromFilesystem( this.fileFromBrowser ).subscribe( fileContent => {
                        this.backend.postRequestWithProgress( 'configuration/transfer/import', null, { file: fileContent, ignoreUnknownTables: this.ignoreUnknownTables }, progress ).subscribe( response => {
                                this.isAfterUpload = this.importOK = true;
                                this.isImporting = this.isUploading = false;
                                this.importResponse = response;
                            },
                            error => {
                                this.isAfterUpload = true;
                                this.importOK = false;
                                this.isImporting = this.isUploading = false;
                                this.importErrorID = this.toast.sendToast( this.lang.getLabel('ERR_IMPORT_FAILED'), 'error', this.importErrorMessage = error.error.error.message );
                            });
                    } );
                }
            }
        );
        return;
    }

    private get filename() {
        if ( !this.fileFromBrowser ) return '';
        return this.fileFromBrowser.name;
    }

    private fileSelectionChange() {
        if ( this.fileupload.element.nativeElement.files.length === 1 ) this.fileFromBrowser = this.fileupload.element.nativeElement.files[0];
        this.fileSelectedOrDropped();
        this.fileupload.element.nativeElement.value = null;
        return false;
    }

    private fileSelectedOrDropped() {
        this.isAfterUpload = this.isUploading = false;
        this.importOK = null;
        if ( this.importErrorID ) {
            this.toast.clearToast( this.importErrorID );
            this.importErrorID = null;
        }
    }

    private get fileReadyForUpload() {
        return this.fileFromBrowser && true;
    }

    private readFileFromFilesystem( file: File ): Observable<string> {
        let responseSubject = new Subject<string>();
        let reader = new FileReader();
        reader.onloadend = () => {
            let fileContent = reader.result.toString();
            fileContent = fileContent.substring( fileContent.indexOf('base64,') + 7 );
            responseSubject.next( fileContent );
            responseSubject.complete();
        };
        reader.readAsDataURL( file );
        return responseSubject.asObservable();
    }

    private onDrop( event: DragEvent ) {
        event.preventDefault(); // Turn off the browser's default drag and drop handler.
        this.isDragOver = false;
        if ( event.dataTransfer.items ) {
            // Use DataTransferItemList interface to access the file
            if ( event.dataTransfer.items.length !== 1 || event.dataTransfer.items[0].kind !== 'file' ) { // We only accept a file, one single file.
                this.showDropError();
                return;
            }
            const file = event.dataTransfer.items[0].getAsFile();
            if ( file.name.split('.').pop() !== 'gz' ) { // We only accept a file with the extension "gz".
                this.showDropError();
                return;
            }
            this.fileFromBrowser = file;
        } else {
            // Use DataTransfer interface to access the file
            if ( event.dataTransfer.files.length !== 1 ) return; // We only accept one single file.
            if ( event.dataTransfer.files[0].name.split('.').pop() !== 'gz' ) { // We only accept a file with the extension "gz".
                this.showDropError();
                return;
            }
            this.fileFromBrowser = event.dataTransfer.files[0];
        }
        if ( this.dropErrorMessageCode ) this.toast.clearToast( this.dropErrorMessageCode );
        this.fileSelectedOrDropped();
    }

    private showDropError() {
        if ( this.dropErrorMessageCode ) this.toast.clearToast( this.dropErrorMessageCode );
        this.dropErrorMessageCode = this.toast.sendToast('You can drop only a file. One file. With the extension "gz".','error', null, false, this.dropErrorMessageCode );
    }

    private onDragOver( event: DragEvent ) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        this.isDragOver = true;
    }

    private onDragLeave() {
        this.isDragOver = false;
    }

}
