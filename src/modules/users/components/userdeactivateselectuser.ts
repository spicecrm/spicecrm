/**
 * @module ModuleUsers
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
    selector: 'user-deactivate-select-user',
    templateUrl: "./src/modules/users/templates/userdeactivateselectuser.html"
})
export class UserDeactivateSelectUser implements OnDestroy {


    private subscriptions: Subscription = new Subscription();

    private selectedItem: any;

    private module = 'Users';

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal) {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    get placeholder() {
        // return default placeholder
        return this.language.getModuleCombinedLabel('LBL_SEARCH', this.module);
    }

    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.module;
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = items[0];
                    }
                })
            );
        });
    }

    private clearField() {
        this.selectedItem = undefined;
    }

}
