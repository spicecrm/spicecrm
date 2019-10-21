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
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemrejectcontainer.html',
    providers: [model, view]
})
export class SalesDocsItemRejectContainer implements OnInit {

    /**
     * the item to be displayed
     */
    @Input() private item: any = {};

    private fieldset: string;

    constructor(private language: language, private model: model, private view: view, private metadata: metadata) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item);

        let componentconfig = this.metadata.getComponentConfig('SalesDocsItemRejectContainer', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }
}
