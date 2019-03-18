/**
 * @module ObjectComponents
 */
import {Component, AfterViewInit, ViewChild, ViewContainerRef, Renderer} from "@angular/core";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: "object-relatedlist-files",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistfiles.html",
    providers: [modelattachments],
    host: {
        "(drop)": "this.onDrop($event)",
        "(dragover)": "this.preventdefault($event)"
    }
})
export class ObjectRelatedlistFiles implements AfterViewInit {

    @ViewChild("fileupload", {read: ViewContainerRef}) private fileupload: ViewContainerRef;

    private componentconfig: any = {};
    private displayitems: number = 5;
    private theFile: string = "";
    private theProgress: number = 0;
    private showUploadModal: boolean = false;
    private isopen: boolean = true;

    constructor(private modelattachments: modelattachments, private language: language, private model: model, private renderer: Renderer, private toast: toast, private footer: footer, private metadata: metadata, private modalservice: modal) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    private loadFiles() {
        this.modelattachments.getAttachments();
    }

    public ngAfterViewInit() {
        setTimeout(()=> this.loadFiles(), 10);
    }

    private toggleOpen() {
        this.isopen = !this.isopen;
    }

    get iconStyle() {
        if (!this.isopen) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }

    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.allItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private allItemsFile(items) {
        for (let item of items) {
            if (item.kind != 'file') {
                return false;
            }
        }

        return true;
    }

    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }


    private canViewAll() {
        return true;
    }

    private selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.renderer.invokeElementMethod(this.fileupload.element.nativeElement, "dispatchEvent", [event]);
    }

    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    private closeUploadPopup() {
        this.showUploadModal = false;
    }

    private getBarStyle() {
        return {
            width: this.theProgress + "%"
        };
    }

    private takeFoto() {
        this.modalservice.openModal("SystemCaptureImage").subscribe(modal => {
            modal.instance.model = this.model;
            modal.instance.response$.subscribe(file => {
                this.modelattachments.files.push(file);
            });
        });
    }
}
