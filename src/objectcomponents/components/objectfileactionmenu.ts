import {Component, ElementRef, Input, Renderer} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {modelattachments} from "../../services/modelattachments.service";
import {popup} from "../../services/popup.service";
import {broadcast} from "../../services/broadcast.service";

@Component({
    selector: "object-file-action-menu",
    templateUrl: "./src/objectcomponents/templates/objectfileactionmenu.html",
    providers: [popup]
})
export class ObjectFileActionMenu {

    @Input() private buttonsize: string = "";
    @Input() private fileid: string = "";
    @Input() private filename: string = "";
    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private broadcast: broadcast, private modelattachments: modelattachments, private language: language, private elementRef: ElementRef, private popup: popup, private renderer: Renderer) {
        popup.closePopup$.subscribe(close => {
            this.isOpen = false;
        });
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listenGlobal("document", "click", (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    private getButtonSizeClass(){
        if(this.buttonsize !== "") {
            return "slds-button--icon-" + this.buttonsize;
        }
    }

    private getDropdownLocationClass(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if(window.innerHeight - rect.bottom < 100) {
            return "slds-dropdown--bottom";
        }
    }

    private deleteFile() {
        this.isOpen = false;
        this.modelattachments.deleteAttachment(this.fileid);
    }

    private downloadFile() {
        this.isOpen = false;
        this.modelattachments.downloadAttachment(this.fileid, this.filename);
    }
    private openFile() {
        this.isOpen = false;
        this.modelattachments.openAttachment(this.fileid);
    }
}
