/**
 * @module Outlook
 */

import {ChangeDetectorRef, Component, Input, NgZone, OnDestroy} from "@angular/core";
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
    selector: 'outlook-calendaritem-add-container',
    templateUrl: '../templates/outlookcalendaritemaddcontainer.html',
    providers: [model, view]
})
export class OutlookCalendarItemAddContainer implements OnDestroy {

    /**
     * the custom prperties of the mailbox item
     */
    @Input() public customProperties: any;

    /**
     * Input radio Options ...
     * ToDo: needs to be replaced witha load of modules that can be added, loadded form the mapping in the config
     */
    public modules: InputRadioOptionI[] = [
        {value: '', label: 'LBL_NONE'}
    ];

    /**
     * the current set module
     */
    public _module: string = '';

    /**
     * indicates if the change of the moduel is allowed
     * we are not allwoing it if the user opens the panel up angain and the module is set
     * as we cannot control the status of sync with the backend
     */
    public allowModuleChange: boolean = true;

    /**
     * the componentset to be rendered for the module
     */
    public fieldset: string;

    /**
     * the model subscription
     */
    public modelsubscription: Subscription;

    private timeout: number;

    constructor(
        public backend: backend,
        public configuration: configurationService,
        public model: model,
        public view: view,
        private cdRef: ChangeDetectorRef,
        private zone: NgZone,
        public metadata: metadata
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
        this.loadExchangeConfig();
        // subscribe to the model changes and set the data
        this.modelsubscription = this.model.data$.subscribe(() => {
            this.saveChanges();
        });
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

        this.zone.run(() => {

            // force reload the fieldset view
            this._module = undefined;
            this.cdRef.detectChanges();

            this._module = module;

            if (module && this._module) {
                let componentconfig = this.metadata.getComponentConfig('OutlookCalendarItemAddContainer', module);
                this.fieldset = componentconfig.fieldset;

                this.model.module = module;
                this.model.initialize();

            } else {
                // clear the fieldset
                this.fieldset = undefined;
                this.clearCustomProperties(['_module'].concat(this.getFields()));
            }
        });

    }

    public ngOnDestroy() {
        this.modelsubscription.unsubscribe();
    }

    /**
     * gets the fields that should be stored or
     */
    public getFields(): string[] {
        let fields = [];

        let fieldSetFields = this.metadata.getFieldSetFields(this.fieldset);
        for (let fieldSetField of fieldSetFields) {
            let fieldData = this.metadata.getFieldDefs(this.model.module, fieldSetField.field);
            switch (fieldData.type) {
                case 'relate':
                    fields.push(fieldSetField.field);
                    fields.push(fieldData.id_name);
                    break;
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
    public loadExchangeConfig() {
        let config = this.configuration.getData('microsoftserviceuserconfig');

        if (typeof config != 'object') return;

        Object.keys(config).forEach(key => {
            if (['calendar', 'events'].indexOf(config[key].exchange_object ?? config[key].service_name) > -1 && config[key].outlookaddenabled == '1') {
                let addmodule = this.metadata.getModuleById(config[key].sysmodule_id);
                this.modules.push({
                    value: addmodule,
                    label: this.metadata.getModuleDefs(addmodule).singular_label
                });
            }
        });
    }

    /**
     * save model changes to the custom properties
     */
    public saveChanges() {

        clearTimeout(this.timeout);

        this.timeout = window.setTimeout(() => {

            const fields = this.getFields();
            let values: outlookNameValuePairI[] = [];

            for (let field of fields) {
                values.push({name: field, value: this.model.getField(field)});
            }

            values.push(
                {name: '_module', value: this.module},
                {name: '_id', value: this.model.id},
            );

            this.setCustomProperties(values);
        }, 500);

    }

    /**
     * set custom properties
     *
     * @param values
     */
    public setCustomProperties(values: outlookNameValuePairI[]) {
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
    public clearCustomProperties(names: string[]) {
        for (let name of names) {
            this.customProperties.remove(name);
        }
        this.customProperties.saveAsync();
    }

}
