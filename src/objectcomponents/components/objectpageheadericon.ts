/**
 * @module ObjectComponents
 */
import {Component, inject, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from "../../services/backend.service";

@Component({
    selector: 'object-page-header-icon',
    templateUrl: '../templates/objectpageheadericon.html'
})
export class ObjectPageHeaderIcon{

    /**
     * an image field on the model
     */
    @Input() public imagefield: string;

    public showEdit: boolean = false;

    constructor(
        public router: Router,
        public model: model,
        public modal: modal,
        public metadata: metadata,
        public backend: backend
    ) {
    }

    /**
     * checks that the user can navigate to the module
     */
    get canGoToModule() {
        return this.metadata.getModuleDefs(this.model.module).visible && this.metadata.checkModuleAcl(this.model.module, 'list');
    }

    /**
     * opens the regular list view
     */
    public goToModule() {
        if (this.canGoToModule) {
            this.router.navigate(['/module/' + this.model.module]);
        }
    }

    get image() {
        return this.model.getField(this.imagefield);
    }

    /**
     * returns the style with the opacity for the layover
     */
    get editstyle() {
        return {
            opacity: this.showEdit ? 1 : 0
        };
    }

    /**
     * registers the mouse enter and sets the edit show to true
     */
    public onMouseEnter() {
        this.showEdit = true;
    }

    /**
     * registers the mouse leave and sets the edit show to false
     */
    public onMouseLeave() {
        this.showEdit = false;
    }


    /**
     * renders the upload modal to allow the user to change the image
     */
    public changeImage() {
        this.modal.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 150;
            componentref.instance.cropwidth = 150;
            componentref.instance.imageBase64 = this.model.getField(this.imagefield) ?? undefined;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                    if(image == 'delete'){
                        this.backend.deleteRequest(`module/${this.model.module}/${this.model.id}/image/${this.imagefield}`).subscribe({
                            next: (response) => {
                                this.model.setField(this.imagefield, undefined);
                            },
                            error: (error) => {

                            }
                        });
                    } else {
                        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/image/${this.imagefield}`, {}, {
                            imagedata: image.split(',')[1]
                        }).subscribe({
                            next: (response) => {
                                this.model.setField(this.imagefield, image);
                            },
                            error: (error) => {

                            }
                        });
                    }
                }
            });
        });
    }
}
