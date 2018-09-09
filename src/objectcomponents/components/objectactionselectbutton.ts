import {Component, Input, ElementRef, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-select-button',
    templateUrl: './src/objectcomponents/templates/objectactionselectbutton.html',
    providers: [model],
    host: {
        'class': 'slds-button slds-button--neutral'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class ObjectActionSelectButton implements OnInit {

    displayModal: boolean = false;
    popupSubscribe: any = undefined;
    actionconfig: any = {};
    parent: any = {};

    constructor(private metadata: metadata, private language: language, private modal: modal, private model: model, private relatedmodels: relatedmodels) {
    }

    ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
    }

    openModal() {
        if(this.actionconfig.searchConditions){
            this.modal.openModal('ObjectModalModuleDBLookup').subscribe(selectModal => {
                selectModal.instance.searchConditions = this.actionconfig.searchConditions;
                selectModal.instance.module = this.model.module;
                selectModal.instance.multiselect = true;
                selectModal.instance.selectedItems.subscribe(items => {
                    this.addSelectedItems(items);
                });
            });
        } else {
            this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
                selectModal.instance.module = this.model.module;
                selectModal.instance.multiselect = true;
                selectModal.instance.selectedItems.subscribe(items => {
                    this.addSelectedItems(items);
                });
            });
        }
    }

    addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }

}