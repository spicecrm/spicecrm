import {Component, Input, OnInit} from "@angular/core";
import {Subscription} from "rxjs";

import {outlookNameValuePairI} from "../interfaces/outlook.interfaces";
import {InputRadioOptionI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";

import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {configurationService} from "../../../services/configuration.service";

declare var _: any;

/**
 * a comtaner that allows adding the required information to link a mailtitem object to a crm object
 */
@Component({
    selector: 'outlook-meeting-add-container',
    templateUrl: './src/include/outlook/templates/outlookmeetingaddcontainer.html',
    providers: [model, view]
})
export class OutlookMeetingAddContainer {

    /**
     * the custom prperties of the mailbox item
     */
    @Input() private customProperties: any;

    /**
     * Input radio Options ...
     * ToDo: needs to be replaced witha load of modules that can be added, loadded form the mapping in the config
     */
    private modules: InputRadioOptionI[] = [
        {value: '', label: 'LBL_NONE'}
    ];

    /**
     * the current set module
     */
    private _module: string = '';

    /**
     * indicates if the change of the moduel is allowed
     * we are not allwoing it if the user opens the panel up angain and the module is set
     * as we cannot control the status of sync with the backend
     */
    private allowModuleChange: boolean = true;

    /**
     * the componentset to be rendered for the module
     */
    private fieldset: string;

    /**
     * the model subscription
     */
    private modelsubscription: Subscription;

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private model: model,
        private view: view,
        private metadata: metadata
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
        this.loadExchangeConfig();
    }

    get canAdd() {
        return this.modules.length > 1;
    }

    /**
     * returns the module
     */
    get module() {
        return this._module;
    }

    /**
     * sets the module and triggers the determination of the componentset
     *
     * @param module
     */
    set module(module) {
        this._module = module;

        if (module && this._module) {
            let componentconfig = this.metadata.getComponentConfig('OutlookMeetingAddContainer', module);
            this.fieldset = componentconfig.fieldset;

            this.model.module = module;
            this.model.initialize();

            if (module != this.customProperties.get('_module')) {
                this.setCustomProperties([{name: '_module', value: module}]);
            }

            // load the values
            let fields = this.getFields();
            let modelValues = {};
            for (let field of fields) {
                let cProp = this.customProperties.get(field);
                if (cProp) {
                    modelValues[field] = cProp;
                }
            }
            if (!_.isEmpty(modelValues)) {
                this.model.setFields(modelValues);
            }

            // subscribe to the model changes and set the data
            this.modelsubscription = this.model.data$.subscribe(changed => {
                this.saveChanges(changed);
            });

        } else {

            // clear the custom properties
            this.clearCustomProperties(['_module'].concat(this.getFields()));

            // clear the fieldset
            this.fieldset = undefined;

            if (this.modelsubscription) {
                this.modelsubscription.unsubscribe();
                this.modelsubscription = undefined;
            }
        }
    }

    /**
     * gets the fields that should be stored or
     */
    private getFields(): string[] {
        let fields = [];

        let fieldSetFields = this.metadata.getFieldSetFields(this.fieldset);
        for (let fieldSetField of fieldSetFields) {
            let fieldData = this.metadata.getFieldDefs(this.model.module, fieldSetField.field);
            switch (fieldData.type) {
                case 'parent':
                    fields.push(fieldSetField.field);
                    fields.push(fieldData.type_name);
                    fields.push(fieldData.id_name);
                    break;
                default:
                    fields.push(fieldSetField.field);
                    break;
            }
        }


        return fields;
    }


    /**
     * loads the modules that can be added from Outlook
     */
    private loadExchangeConfig() {
        let config = this.configuration.getData('exchangeuserconfig');
        for (let e of config) {
            if (e.exchange_object == 'calendar' && e.outlookaddenabled == '1') {
                let addmodule = this.metadata.getModuleById(e.sysmodule_id);
                this.modules.push({
                    value: addmodule,
                    label: this.metadata.getModuleDefs(addmodule).singular_label
                });
            }
        }
    }

    private setItemModule() {
        let itemModule = this.customProperties.get('_module');

        // if we have a module then do not allow changing it
        if (itemModule) this.allowModuleChange = false;

        // triugger the set of the module
        this.module = itemModule ? itemModule : '';
    }

    /**
     * save model changes to the custom properties
     *
     * @param changes
     */
    private saveChanges(changes) {
        let values: outlookNameValuePairI[] = [];
        let fields = this.getFields();
        for (let field of fields) {
            values.push({name: field, value: this.model.getField(field)});
        }
        this.setCustomProperties(values);
    }

    /**
     * set custom properties
     *
     * @param values
     */
    private setCustomProperties(values: outlookNameValuePairI[]) {
        for (let nmp of values) {
            this.customProperties.set(nmp.name, nmp.value);
        }
        this.customProperties.saveAsync();
    }

    /**
     * clear custom properties
     *
     * @param names
     */
    private clearCustomProperties(names: string[]) {
        for (let name of names) {
            this.customProperties.remove(name);
        }
        this.customProperties.saveAsync();
    }

}
