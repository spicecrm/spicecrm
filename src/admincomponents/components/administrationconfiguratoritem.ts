/**
 * @module AdminComponentsModule
 */
import {
    Component, Injector,
    Input
} from '@angular/core';
import {language} from '../../services/language.service';
import {helper} from '../../services/helper.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';
import {modal} from "../../services/modal.service";

@Component({
    selector: '[administration-configurator-item]',
    templateUrl: '../../admincomponents/templates/administrationconfiguratoritem.html'
})
export class AdministrationConfiguratorItem {

    @Input() public fields: any[] = [];
    @Input() public entry: any = {};

    constructor(public administrationconfigurator: administrationconfigurator, public language: language, public helper: helper, public modal: modal, public injector: Injector) {
    }

    /**
     * a getter for the item fields that excludes fields that have a detail only flag set
     */
    get itemFields(){
        return this.fields.filter(f => f.detailonly !== true);
    }

    public setEditMode() {
        this.administrationconfigurator.setEditMode(this.entry.id);
    }

    public isEditMode(field = null) {
        if (!field) {
            return this.administrationconfigurator.isEditMode(this.entry.id);
        } else {
            return !field.readonly && this.administrationconfigurator.isEditMode(this.entry.id);
        }
    }

    public setViewMode() {
        this.administrationconfigurator.cancelEditMode(this.entry.id);
    }

    get canSave(){
        return this.administrationconfigurator.canSave(this.entry.id);
    }

    public save() {
        this.administrationconfigurator.saveEntry(this.entry.id);
    }

    public delete() {
        this.helper.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_RECORD', 'long'))
            .subscribe(answer => {
                if (answer) {
                    this.administrationconfigurator.deleteEntry(this.entry.id);
                }
            });
    }

    public copy(id) {
        this.administrationconfigurator.copy(id);
    }

    public getJSON(value) {
        try {
            let object = JSON.parse(value);
            return JSON.stringify(object, null, 2);
        } catch (e) {
            return value;
        }
    }

    public goDetail(){
        this.modal.openModal('AdministrationConfiguratorItemModal', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.fields = this.fields;
                modalRef.instance.entry = this.entry;
            }
        })
    }
}
