/**
 * @module ModuleProcurementDocs
 */
import {Component,Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'procurement-docs-item-reject-container',
    templateUrl: '../templates/procurementdocsitemrejectcontainer.html',
    providers: [model, view]
})
export class ProcurementDocsItemRejectContainer implements OnInit {

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
        this.model.module = 'ProcurementDocItems';
        this.model.id = this.item.id;
        this.model.setData(this.item);

        let componentconfig = this.metadata.getComponentConfig('ProcurementDocsItemRejectContainer', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }
}
