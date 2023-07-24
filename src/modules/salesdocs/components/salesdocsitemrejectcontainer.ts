/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'salesdocs-item-reject-container',
    templateUrl: '../templates/salesdocsitemrejectcontainer.html',
    providers: [model, view]
})
export class SalesDocsItemRejectContainer implements OnInit {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    public fieldset: string;

    constructor(public language: language, public model: model, public view: view, public metadata: metadata) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;

        // set explicit to edit in cancel modal
        // ToDo: make proper ACL action on sales docs that allows the cancellation and then triggers this here
        this.item.acl.edit = true;

        // set the data
        this.model.setData(this.item);

        let componentconfig = this.metadata.getComponentConfig('SalesDocsItemRejectContainer', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }
}
