/**
 * @module ObjectComponents
 */
import {Component, Input, NgZone, Injector} from '@angular/core';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {modellist} from '../../services/modellist.service';
import {ObjectActionContainer} from "./objectactioncontainer";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders the action menu on the top left corner of the regular list view
 */
@Component({
    selector: 'object-list-header-actionmenu',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionmenu.html'
})
export class ObjectListHeaderActionMenu extends ObjectActionContainer {

    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    constructor(private modellist: modellist, public language: language, public metadata: metadata, public model: model, public ngZone: NgZone, private modal: modal, private injector: Injector) {
        super(language, metadata, model, ngZone);
    }

    /**
     * initialize on Change
     */
    public ngOnChanges() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.actionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            this.actionitems.push({
                disabled: true,
                id: actionitem.id,
                sequence: actionitem.sequence,
                action: actionitem.action,
                component: actionitem.component,
                actionconfig: actionitem.actionconfig
            });
        }
    }

    /**
     * selects all items
     */
    get selectAll() {
        return this.modellist.listSelected.type === 'all';
    }

    /**
     * returns if any items are selected
     */
    get hasSelection() {
        return this.modellist.getSelectedCount() > 0;
    }

    /**
     * opens the modal allowing theuser to choose and select the display fields
     */
    private chooseFields() {
        if (!this.canChooseFields) {
            return false;
        }
        this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
    }

    /**
     * returns if we do not have a standrad list and thus can edit
     */
    get canChooseFields() {
        return this.modellist.listtype != 'all' && this.modellist.listtype != 'owner' && this.modellist.checkAccess('edit');
    }
}
