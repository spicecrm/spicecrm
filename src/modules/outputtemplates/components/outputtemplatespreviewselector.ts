/**
 * @module ModuleOutputTenmplates
 */
import {
    Component, Input, OnDestroy
} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * renders a tabbed view for body, header and footer of a template
 */
@Component({
    selector: 'output-templates-preview-selector',
    templateUrl: "../templates/outputtemplatespreviewselector.html"
})
export class OutputTemplatesPreviewSelector implements OnDestroy {


    public subscriptions: Subscription = new Subscription();

    public selectedItem: any;

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal) {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    get module() {
        return this.model.getField('module_name');
    }

    get placeholder() {

        // return default placeholder
        return this.language.getModuleCombinedLabel('LBL_SEARCH', this.module);
    }

    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.module;
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = items[0];
                        // this.setRelated({id: items[0].id, text: items[0].summary_text, data: items[0]});
                    }
                })
            );
        });
    }

    public clearField(){
        this.selectedItem = undefined;
    }

}
