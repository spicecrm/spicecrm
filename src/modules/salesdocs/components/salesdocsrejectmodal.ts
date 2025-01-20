/**
 * @module ModuleSalesDocs
 */
import {Component, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {SalesDocsRejectItemsContainer} from "./salesdocsrejectitemscontainer";
import {toast} from "../../../services/toast.service";

/**
 * renders a modal to set the rejection reason on the items
 */
@Component({
    templateUrl: "../templates/salesdocsrejectmodal.html",
    providers: [view]
})
export class SalesdocsRejectModal {

    /**
     * reference to self passed in from header
     */
    public self: any;

    /**
     * reference to the items container
     * rerquired to get the dirty state
     */
    @ViewChild(SalesDocsRejectItemsContainer) itemContainer!: SalesDocsRejectItemsContainer;

    constructor(
        public language: language,
        public backend: backend,
        public model: model,
        public modal: modal,
        public view: view,
        public toast: toast) {
        this.view.isEditable = false;
    }


    /**
     * closes the moal without further action
     */
    public close() {
        this.self.destroy();
    }

    /**
     * determines if any of the model sint he subview is dorty so a rejection reasons has been set and can be saved
     */
    get canSave() {
        return this.itemContainer && this.itemContainer.hasDirtyModels;
    }

    /**
     * closes the moal without further action
     */
    public save() {
        let awaitModal = this.modal.await('LBL_SAVING')
        this.backend.postRequest('module/SalesDocs/' + this.model.id + '/reject', {}, {items: this.itemContainer.getDirtyItems()}).subscribe({
            next: (res) => {
                awaitModal.emit(true)
                if(res.success) {
                    this.model.setData(res.data);
                    this.close();
                } else {
                    this.toast.sendToast('LBL_ERROR_SAVING', "error");
                }
            }, error: () => {
                this.toast.sendToast('LBL_ERROR_SAVING', "error");
                awaitModal.emit(true)
            }
        })
    }

}
