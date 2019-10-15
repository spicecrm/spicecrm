/**
 * @module ObjectComponents
 */
import {Component, Input, NgZone} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {ObjectActionContainer} from "./objectactioncontainer";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'object-list-header-actionmenu',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionmenu.html'
})
export class ObjectListHeaderActionMenu extends ObjectActionContainer {

     // @Input() private actionset: string = '';

    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    constructor(private modellist: modellist, public language: language, public metadata: metadata, public model: model, public ngZone: NgZone) {
        super(language, metadata, model, ngZone);
    }

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

    get selectAll() {
        return this.modellist.listSelected.type === 'all';
    }

    get hasSelection() {
        return this.modellist.getSelectedCount() > 0;
    }
}
