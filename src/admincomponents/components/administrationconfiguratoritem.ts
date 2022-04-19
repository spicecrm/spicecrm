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

@Component({
    selector: '[administration-configurator-item]',
    templateUrl: '../../admincomponents/templates/administrationconfiguratoritem.html'
})
export class AdministrationConfiguratorItem {

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
}
