/**
 * @module ObjectComponents
 */
import {Component, Renderer2, ElementRef, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {ObjectStatusNetworkButtonItem} from "./objectstatusnetworkbuttonitem";

/**
 * a button to represent the ttaus network supporting moving items from one state to the next
 */
@Component({
    selector: 'object-status-network-button',
    templateUrl: '../templates/objectstatusnetworkbutton.html'
})
export class ObjectStatusNetworkButton implements OnInit {

    /**
     * a selector for the child items
     */
    @ViewChildren(ObjectStatusNetworkButtonItem) public buttonitemlist: QueryList<ObjectStatusNetworkButtonItem>;

    /**
     * the field that is status managed
     */
    public statusField: string = '';

    /**
     * the status network as retrieved from the config
     */
    public statusNetwork: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, public router: Router, public renderer: Renderer2, public elementRef: ElementRef) {

    }

    /**
     * a getter to disable while editing or fi the user is not allowed to edit
     */
    get isDisabled() {
        return this.model.isEditing || !this.model.checkAccess('edit');
    }

    /**
     * cheks if the bean is managed at all
     */
    get isManaged() {
        return this.statusField != '' && this.primaryItem !== false && !this.isDisabled;
    }

    /**
     * returns the primary status item
     */
    get primaryItem() {
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField) && (!statusnetworkitem.required_model_state || this.model.checkModelState(statusnetworkitem.required_model_state))) {
                return statusnetworkitem;
            }
        }

        return false;
    }

    /**
     * a getter for all secoindray status items
     */
    get secondaryItems() {
        let retArray = [];
        let firstHit = false;
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField) && (!statusnetworkitem.required_model_state || this.model.checkModelState(statusnetworkitem.required_model_state))) {

                if (firstHit) {
                    retArray.push(statusnetworkitem);
                }

                if (!firstHit) firstHit = true;
            }
        }
        return retArray;
    }

    /**
     * loads the status network
     */
    public ngOnInit() {
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if (statusmanaged != false) {
            this.statusField = statusmanaged.statusField;
            this.statusNetwork = statusmanaged.statusNetwork;
        }
    }

    /**
     * propagates the clisk to the item. This is handled on the LI level to enable a rpopr UX to allow clicking on the list and not the action item component
     *
     * @param actionid
     */
    public propagateclick(actionid) {
        this.buttonitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                actionitem.setStatus(this.statusField);
                return true;
            }
        });
    }
}
