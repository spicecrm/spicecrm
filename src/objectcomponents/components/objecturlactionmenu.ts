/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Injector, Input} from "@angular/core";
import {language} from "../../services/language.service";
import {modelurls} from "../../services/modelurls.service";
import {broadcast} from "../../services/broadcast.service";
import {modal} from '../../services/modal.service';
import {model} from "../../services/model.service";

/**
 * renders the action menu for the url
 */
@Component({
    selector: "object-url-action-menu",
    templateUrl: "../templates/objecturlactionmenu.html"
})
export class ObjectUrlActionMenu {

    /**
     * holds the url
     */
    @Input() public url: any;

    constructor(
        public broadcast: broadcast,
        public modelurls: modelurls,
        public language: language,
        public elementRef: ElementRef,
        public modal: modal,
        public injector: Injector,
        public model: model){}

    /**
     * determines where the menu is opened
     */
    public getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100) {
            return "slds-dropdown--bottom";
        }
    }

    /**
     * action to delete the url
     */
    public deleteFile() {
        this.modal.confirm(this.language.getLabel('QST_DELETE_FILE'), this.language.getLabel('QST_DELETE_FILE', null, 'short')).subscribe((answer) => {
            if (answer) this.modelurls.deleteUrl(this.url.id);
        });
    }

    /**
     * open edit modal and fill in the input data
     */
    public edit() {
        this.modal.openModal('SpiceUrlsEditModal', true, this.injector).subscribe(modalRef => {
                modalRef.instance.url = this.url;
                modalRef.instance.inputData = {
                    url: this.url.url,
                    description: this.url.description,
                    url_name: this.url.url_name,
                };
            }
        );
    }

}
