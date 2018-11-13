import {Component, Input, ElementRef, OnInit, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-select-button',
    templateUrl: './src/objectcomponents/templates/objectactionselectbutton.html',
    providers: [model]
})
export class ObjectActionSelectButton implements OnInit {

    public actionconfig: any = {};
    public parent: any = {};
    public disabled: boolean = true;

    constructor(private metadata: metadata, private language: language, private modal: modal, private model: model, private relatedmodels: relatedmodels) {
    }

    public ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "list")) {
            this.disabled = false;
        }
    }

    public execute() {
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

    private addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }

}
