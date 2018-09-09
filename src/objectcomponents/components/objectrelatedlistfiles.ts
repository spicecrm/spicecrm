import {Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';
import {modelattachments} from '../../services/modelattachments.service';
import {metadata} from '../../services/metadata.service';
import {footer} from '../../services/footer.service';
import { modal } from '../../services/modal.service';

@Component({
    selector: 'object-relatedlist-files',
    templateUrl: './app/objectcomponents/templates/objectrelatedlistfiles.html',
    providers: [modelattachments],
    host: {
        '(drop)': 'this.onDrop($event)',
        '(dragover)': 'this.preventdefault($event)',
        '(dragleave)': 'this.preventdefault($event)'
    },
    styles: [
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}'
    ]
})
export class ObjectRelatedlistFiles implements AfterViewInit {

    @ViewChild('fileupload', {read: ViewContainerRef}) fileupload: ViewContainerRef;

    componentconfig: any = {};
    displayitems: number = 5;
    theFile: string = '';
    theProgress: number = 0;
    showUploadModal: boolean = false;

    constructor(private modelattachments: modelattachments, private language: language, private model: model, private renderer: Renderer, private toast: toast, private footer: footer, private metadata: metadata, private modalservice: modal ) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    loadFiles() {
        this.modelattachments.getAttachments();
    }

    ngAfterViewInit() {
        this.loadFiles();
    }

    preventdefault(event: any) {
        if((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1)
            this.doupload(files);
    }

    setDisplayItems(count) {

    }

    canViewAll() {
        return true
    }

    selectFile() {
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(this.fileupload.element.nativeElement, 'dispatchEvent', [event]);
    }

    uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    doupload(files) {
        this.showUploadModal = true;
        this.theFile = files[0].name;
        this.modelattachments.uploadAttachments(files).subscribe((retVal: any) => {
            if (retVal.progress) {
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100
            } else if (retVal.files) {
                for (let file of retVal.files)
                    this.modelattachments.files.push(file);
            }
        }, error => {
            this.toast.sendToast('upload fialed');
            this.closeUploadPopup();
        }, () => this.closeUploadPopup());
    }

    closeUploadPopup() {
        this.showUploadModal = false;
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

    takeFoto(){
        this.modalservice.openModal('SystemCaptureImage').subscribe(modal => {
            modal.instance.model = this.model;
            modal.instance.response$.subscribe(file => {
                this.modelattachments.files.push(file);
            })
        })
    }
}