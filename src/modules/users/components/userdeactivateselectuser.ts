/**
 * @module ModuleUsers
 */
import {
    Component, Input, OnDestroy, EventEmitter, Output
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
    templateUrl: "../templates/userdeactivateselectuser.html"
})
export class UserDeactivateSelectUser implements OnDestroy {


    /**
     * holds the components subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the current selected item
     */
    public selectedItem: any;

    /**
     * an emitter for the userid
     */
    @Output() public  userid$: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal) {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    get placeholder() {
        // return default placeholder
        return this.language.getModuleCombinedLabel('LBL_SEARCH', 'Users');
    }

    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = items[0];
                        this.userid$.emit(this.selectedItem.id);
                    }
                })
            );
        });
    }

    public clearField() {
        this.selectedItem = undefined;
    }

}
