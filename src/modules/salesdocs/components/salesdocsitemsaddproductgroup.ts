/**
 * @module ModuleSalesDocs
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    Output
} from '@angular/core';


import {modelutilities} from '../../../services/modelutilities.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";

@Component({
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class SalesDocsItemsAddProductGroup extends ObjectModalModuleLookup {

    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model) {
        super(language, modellist, metadata, modelutilities, model);

        // set module to Products
        this.module = 'ProductGroups';
    }

    public clickRow(event, item) {
        this.productSelected(item);
        this.self.destroy();
    }

    private productSelected(productgroup) {

        // compose the items to be added
        let itemData = {
            parent_type: 'ProductGroups',
            parent_id: productgroup.id,
            productgroup_id: productgroup.id,
            parent_name: productgroup.name,
            productgroup_name: productgroup.name,
            name: productgroup.name,
        };

        this.additem.emit(itemData);

        // destroy the modal
        this.self.destroy();
    }

}
