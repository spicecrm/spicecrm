import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';

@Component({
    selector: '[administration-configurator-item]',
    templateUrl: './src/admincomponents/templates/administrationconfiguratoritem.html'
})
export class AdministrationConfiguratorItem implements OnInit{

    @Input() fields: Array<any> = [];
    @Input() entry: any = {};

    constructor(private administrationconfigurator: administrationconfigurator) {
    }

    ngOnInit(){

    }

    setEditMode() {
        this.administrationconfigurator.setEditMode(this.entry.id);
    }

    isEditMode(field = null) {
        if (!field)
            return this.administrationconfigurator.isEditMode(this.entry.id);
        else
            return !field.readonly && this.administrationconfigurator.isEditMode(this.entry.id);
    }

    setViewMode() {
        this.administrationconfigurator.cancelEditMode(this.entry.id);
    }

    save() {
        this.administrationconfigurator.saveEntry(this.entry.id);
    }

    delete() {
        this.administrationconfigurator.deleteEntry(this.entry.id);
    }

    copy(id)
    {
        this.administrationconfigurator.copy(id);
    }

    getJSON(value) {
        try {
            let object = JSON.parse(value);
            return JSON.stringify(object, null, 2);
        } catch (e) {
            return value;
        }
    }
}