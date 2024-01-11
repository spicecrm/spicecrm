/**
 * @module AdminComponentsModule
 */
import {
    Component,
    Input
} from '@angular/core';
import {language} from '../../services/language.service';
import {helper} from '../../services/helper.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';

declare var moment: any;

@Component({
    selector: 'administration-configurator-item-modal',
    templateUrl: '../../admincomponents/templates/administrationconfiguratoritemmodal.html'
})
export class AdministrationConfiguratorItemModal {

    public self: any;

    @Input() public fields: any[] = [];
    @Input() public entry: any = {};

    constructor(public administrationconfigurator: administrationconfigurator, public language: language, public helper: helper) {
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
        this.administrationconfigurator.saveEntry(this.entry.id).subscribe({
            next: () => {
                this.self.destroy();
            }
        });
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

    public getForeignName(fieldname){
        if(!this.entry.data[fieldname]) return this.entry.data[fieldname];
        let options = this.getForeignKeys(fieldname);
        let option = options.find(o => o.value == this.entry.data[fieldname]);
        return option ? option.display : this.entry.data[fieldname];
    }

    public getForeignKeys(fieldname){
        return this.administrationconfigurator.foreignkeys[fieldname].sort((a, b) => a.display.localeCompare(b.display));
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

    public close(){
        this.administrationconfigurator.cancelEditMode(this.entry.id);
        this.self.destroy();
    }

}
