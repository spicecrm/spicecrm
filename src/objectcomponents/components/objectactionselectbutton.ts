/**
 * @module ObjectComponents
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-select-button',
    templateUrl: './src/objectcomponents/templates/objectactionselectbutton.html',
    providers: [model]
})
export class ObjectActionSelectButton implements OnInit, OnDestroy {

    public actionconfig: any = {};
    public parent: any = {};
    public disabled: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(private metadata: metadata, private language: language, private modal: modal, private model: model, private relatedmodels: relatedmodels) {
    }

    public ngOnInit() {
        // set model.module from relatedmodels
        this.model.module = this.relatedmodels.relatedModule;

        // enable button if the list action granted.
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "list")) {
            this.disabled = false;
        }
    }

    /*
    * @openModal ObjectModalModuleDBLookup
    * @pass searchConditions
    * @pass module
    * @pass multiselect = true
    * @pass modulefilter
    * @subscribe to selectedItems
    * @call addSelectedItems
    */
    public execute() {
        if (this.actionconfig.searchConditions) {
            this.modal.openModal('ObjectModalModuleDBLookup').subscribe(selectModal => {
                selectModal.instance.searchConditions = this.actionconfig.searchConditions;
                selectModal.instance.module = this.model.module;
                selectModal.instance.multiselect = true;
                this.subscriptions.add(
                    selectModal.instance.selectedItems.subscribe(items => {
                        this.addSelectedItems(items);
                    })
                );
            });
        } else {
            this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
                selectModal.instance.module = this.model.module;
                selectModal.instance.multiselect = true;
                selectModal.instance.modulefilter = this.actionconfig.modulefilter;
                this.subscriptions.add(
                    selectModal.instance.selectedItems.subscribe(items => {
                        this.addSelectedItems(items);
                    })
                );
            });
        }
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @call relatedmodels.addItems
    * @pass event: any[]
    */
    private addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }
}
