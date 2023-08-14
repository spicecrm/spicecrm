/**
 * @module ObjectFields
 */
import {Component, QueryList, ViewChildren} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldEnum} from "./fieldenum";
import {fieldStatusNetworkItem} from "./fieldstatusnetworkitem";

@Component({
    selector: 'field-statusnetwork',
    templateUrl: '../templates/fieldstatusnetwork.html'
})
export class fieldStatusNetwork extends fieldEnum {

    /**
     * a selector for the child items
     */
    @ViewChildren(fieldStatusNetworkItem) public buttonitemlist: QueryList<fieldStatusNetworkItem>;


    public options: any[] = [];

    /**
     * the status network as retrieved from the config
     */
    public statusNetwork: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

        this.subscriptions.add(
            this.language.currentlanguage$.subscribe((language) => {
                this.getOptions();
            })
        );
    }

    public ngOnInit() {
        super.ngOnInit();

        this.initializeNetwork();

        this.getOptions();
    }

    public getValue(): string {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    /**
     * initializes the network
     *
     * @private
     */
    private initializeNetwork(){
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if (statusmanaged != false && statusmanaged.statusField == this.fieldname) {
            this.statusNetwork = statusmanaged.statusNetwork;


        }
    }

    /**
     * a getter for all secoindray status items
     */
    get networkItems() {
        let retArray = [];
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.value && (!statusnetworkitem.required_model_state || this.model.checkModelState(statusnetworkitem.required_model_state))) {
                retArray.push(statusnetworkitem);
            }
        }
        return retArray;
    }

    /**
     * loads the options for the general translated display odf the current status
     */
    public getOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        this.options = retArray;
    }

    /**
     * propagates the clisk to the item. This is handled on the LI level to enable a rpopr UX to allow clicking on the list and not the action item component
     *
     * @param actionid
     */
    public propagateclick(actionid) {
        this.buttonitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                actionitem.setStatus(this.fieldname);
                return true;
            }
        });
    }
}
