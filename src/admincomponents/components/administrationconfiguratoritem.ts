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
import {values} from "underscore";

@Component({
    selector: '[administration-configurator-item]',
    templateUrl: '../../admincomponents/templates/administrationconfiguratoritem.html'
})
export class AdministrationConfiguratorItem {

    @Input() public fields: any[] = [];
    @Input() public entry: any = {};
    @Input() public parentWidth: any;

    constructor(public administrationconfigurator: administrationconfigurator, public language: language, public helper: helper, public modal: modal, public injector: Injector) {
    }


    get divStyle(){
        let itemwidth = parseInt(this.parentWidth, 10) / this.fields.length;
        return {
            'max-width': itemwidth < 200 ? '200px' : itemwidth + 'px'
        }
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

    /**
     * formats a date object so it is proper from a moment
     * @param dateObject
     */
    public setFormattedDate(fieldname, dateObject){
        if(!dateObject || (dateObject && !dateObject.isValid())) {
            this.entry.data[fieldname] = '';
        }
        this.entry.data[fieldname] = dateObject.format('YYYY-MM-DD');
    }

    public getForeignName(fieldname){
        if(!this.entry.data[fieldname]) return this.entry.data[fieldname];
        let options = this.getForeignKeys(fieldname);
        let option = options.find(o => o.value == this.entry.data[fieldname]);
        return option ? option.display : this.entry.data[fieldname];
    }

    public getForeignKeys(fieldname){
        return this.administrationconfigurator.foreignkeys[fieldname].sort((a, b) => a.display.localeCompare(b.display));
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
