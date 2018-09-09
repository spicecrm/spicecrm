import {Component, ViewChild, ViewContainerRef, Input, Output, EventEmitter} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'accounts-contacts-manager-list',
    templateUrl: './app/modules/accounts/templates/accountscontactsmanagerlist.html',
    providers: [view, model]
})
export class AccountsContactsManagerList {

    @ViewChild('tableContainer', {read: ViewContainerRef}) tableContainer: ViewContainerRef;

    listfields: Array<any> = [];
    @Input() fieldset: string = '';
    @Input('tableHeight') tableheight: any = {};
    @Output() activeContactId$: EventEmitter<any> = new EventEmitter<any>();
    activeContactId: string = undefined;
    
    constructor(
        private language: language,
        private metadata: metadata,
        private relatedmodels: relatedmodels,
        private model: model) {
        this.model.module = 'Contacts';
    }

    ngOnInit(){
        let componentConfig = this.metadata.getComponentConfig('AccountsContactsManagerList', 'Accounts');
        this.listfields = this.metadata.getFieldSetFields(componentConfig.fieldset);
    }

    setActiveContactId(id){
        this.activeContactId = id;
        this.activeContactId$.emit(id);

    }

    get contacts(){
        return this.relatedmodels.items;
    }

    get tableHeight(){
        return this.tableheight;
    }
    get isloading(){
        return this.relatedmodels.isloading;
    }
}
