/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import { toast } from '../../services/toast.service';

/**
 * a simple config editor that allows editing config settings for a specific subtree
 */
@Component({
    selector: 'administration-configeditor',
    templateUrl: '../templates/administrationconfigeditor.html'
})
export class AdministrationConfigEditor implements OnInit {

    /**
     * the config from the admin item in the settings
     */
    public componentconfig: any = {};

    /**
     * the values that are held and set
     */
    public configvalues: any = {};

    /**
     * an indicator if the config paramaters are loading
     */
    public loading: boolean = true;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public toast: toast
    ) {

    }

    /**
     * loads the config settings
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('configuration/configurator/editor/' + this.componentconfig.category).subscribe(data => {
                this.configvalues = data;
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });

    }

    /**
     * simnple getter to return the config items
     */
    get items() {
        let items = [];

        for (let field of this.componentconfig.items) {
            if (field.hidden !== true) items.push(field);
        }

        return items;
    }

    /**
     * the save function
     */
    public save() {
        this.loading = true;
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.backend.postRequest('configuration/configurator/editor/' + this.componentconfig.category, [], { config: this.configvalues }).subscribe(data => {
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

    /**
     * Has the browser the ability to paste clipboard data?
     */
    public get canCopyPaste(): boolean {
        return !!navigator.clipboard.readText;
    }

    /**
     * Copy configuration values to clipboard.
     */
    public copyData(): void {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        let valsToCopy = {};
        for( let item of this.componentconfig.items ) valsToCopy[item.name] = ( this.configvalues.hasOwnProperty( item.name ) ? this.configvalues[item.name] : null );
        selBox.value = JSON.stringify(valsToCopy);
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toast.sendToast( 'Data of all fields copied to clipboard.', 'success');
    }

    /**
     * Paste configuration data from clipboard.
     */
    public pasteData(): void {
        navigator.clipboard.readText().then( textData => {
            let objectData;
            let numberPasted = 0, numberEmptied = 0;
            try {
                objectData = JSON.parse( textData );
            } catch( e ) {
                this.toast.sendToast( 'No valid configuration data found in clipboard.', 'error');
                return;
            }
            for( let item of this.componentconfig.items ) {
                if( objectData.hasOwnProperty( item.name ) ) {
                    this.configvalues[item.name] = objectData[item.name];
                    numberPasted++;
                } else {
                    this.configvalues[item.name] = null;
                    numberEmptied++;
                }
            }
            let numberUnknownValues = Object.keys( objectData ).length - numberPasted;
            let comment = '';
            comment += ( numberUnknownValues ? numberUnknownValues+' unknown values ignored. ':'' );
            comment += ( numberEmptied ? numberEmptied+' fields emptied, because no data definied. ':'' );
            this.toast.sendToast('Data pasted from clipboard successfully. ' + comment + 'Don´t forget to save data.', 'success', null, 25 );
        });
    }

    /**
     * The label for the header.
     */
    public get label() {
        return this.componentconfig.label ? this.componentconfig.label : 'LBL_EDITOR';
    }

}
