/**
 * @module ObjectComponents
 */
import {Component, OnDestroy, OnInit, SkipSelf} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-select-button',
    templateUrl: '../templates/objectactionselectbutton.html',
    providers: [model]
})
export class ObjectActionSelectButton implements OnInit, OnDestroy {

    public actionconfig: any = {};
    public disabled: boolean = true;
    public subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata, public language: language, public modal: modal, public model: model, @SkipSelf() public parent: model, public relatedmodels: relatedmodels) {
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
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.model.module;
            selectModal.instance.multiselect = true;
            selectModal.instance.modulefilter = this.actionconfig.modulefilter;

            if (this.actionconfig.relatefilterfield) {
                let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.actionconfig.relatefilterfield);
                if (fieldDefs) {
                    selectModal.instance.relatefilter = {
                        module: fieldDefs.module,
                        relationship: this.actionconfig.relatefilterrelationship,
                        id: this.parent.getField(fieldDefs.id_name),
                        display: this.parent.getField(this.actionconfig.relatefilterfield),
                        active: this.parent.getField(fieldDefs.id_name) ? true : false,
                        required: this.actionconfig.relatedfilterrequired
                    };
                }
            }

            selectModal.instance.selectedItems.subscribe(items => {
                this.addSelectedItems(items);
            });
        });
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
    public addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }
}
