/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnChanges, SimpleChanges
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
@Component({
    selector: 'componentconfigmanager-component-details',
    templateUrl: './src/workbench/templates/componentsetmanagercomponentsetdetails.html'
})
export class ComponentConfigManagerComponentDetails implements OnChanges {

    @ViewChild('optionscontainer', {read: ViewContainerRef, static: true}) optionscontainer: ViewContainerRef;

    @Input() component: any = {};
    configOptions: Array<any> = [];
    optionsElements: Array<any> = [];

    selectedComponent: any = {};

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast) {
    }

    selectComponent(component) {
        if (component.id) {
            this.selectedComponent = component;
        }
        else
            this.selectedComponent = {};
    }

    ngOnChanges(changes: SimpleChanges) {

        // remove any options elements in case some exist
        for (let option of this.optionsElements) {
            option.destroy();
        }
        this.optionsElements = [];

        // build new config options
        this.configOptions = [];
        if (this.component.component) {
            let options = this.metadata.getComponentConfigOptions(this.component.component);
            for (let option in options) {
                this.configOptions.push({
                    option: option,
                    type: options[option].type ? options[option].type : 'string'
                });
            }
        }

        // add the elements dynmically
        for (let option of this.configOptions) {

            // determine which component to add
            let component = '';
            switch (option.type) {
                case 'fieldset':
                    component = 'ComponentsetManagerOptionFieldset';
                    break;
                case 'componentset':
                    component = 'ComponentsetManagerOptionComponentset';
                    break;
                case 'actionset':
                    component = 'ComponentsetManagerOptionActionset';
                    break;;
                case 'module':
                    component = 'ComponentsetManagerOptionModule';
                    break;
                case 'boolean':
                    component = 'ComponentsetManagerOptionBoolean';
                    break;
                case 'label':
                    component = 'LabelSelectorComponent';
                    break;
                default:
                    component = 'ComponentsetManagerOptionDefault';
                    break;
            }

            this.metadata.addComponent(component, this.optionscontainer).subscribe(componentRef => {
                this.optionsElements.push(componentRef);
                componentRef.instance['option'] = option;
                componentRef.instance['component'] = this.component;
            })
        }
    }

    getComponentsetConfig() {
        if (this.component.componentconfig)
            return JSON.stringify(this.component.componentconfig);
    }

}