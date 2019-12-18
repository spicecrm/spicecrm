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

@Component({
    selector: 'object-status-network-button',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbutton.html'
})
export class ObjectStatusNetworkButton implements OnInit {

    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(ObjectStatusNetworkButtonItem) private buttonitemlist: QueryList<ObjectStatusNetworkButtonItem>;

    private isOpen: boolean = false;
    private statusField: string = '';
    private statusNetwork: any[] = [];
    private prmiaryStatus: any = {};
    private secondaryStatuses: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {

    }

    get isDisabled() {
        return this.model.isEditing || !this.model.checkAccess('edit');
    }

    get isManaged() {
        return this.statusField != '' && this.primaryItem !== false && !this.isDisabled;
    }

    get primaryItem() {
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {
                return statusnetworkitem;
            }
        }

        return false;
    }

    get secondaryItems() {
        let retArray = [];
        let firstHit = false;
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {

                if (firstHit) {
                    retArray.push(statusnetworkitem);
                }

                if (!firstHit) firstHit = true;
            }
        }
        return retArray;
    }

    public ngOnInit() {
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if (statusmanaged != false) {
            this.statusField = statusmanaged.statusField;
            this.statusNetwork = statusmanaged.statusNetwork;
        }
    }

    private propagateclick(actionid) {
        this.buttonitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                actionitem.setStatus(this.statusField);
                return true;
            }
        });
    }
}
