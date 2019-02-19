import {Component} from "@angular/core";
import {session} from "../../services/session.service";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: "global-user-panel-icon",
    templateUrl: "./src/globalcomponents/templates/globaluserpanelicon.html",
})
export class GlobaUserPanelIcon {

    private showEdit: boolean = false;

    constructor(
        private session: session,
        private modalservice: modal,
        private backend: backend
    ) {

    }

    private changeImage() {
        this.modalservice.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 150;
            componentref.instance.cropwidth = 150;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                    // make a backup of the image, set it to emtpy and if case call fails set back the saved image
                    let imagebackup = this.session.authData.userimage;
                    this.session.authData.userimage = '';
                    this.backend.postRequest('module/Users/' + this.session.authData.userId + '/image', {}, {imagedata: image}).subscribe(
                        response => {
                            this.session.authData.userimage = image;
                        },
                        error => {
                            this.session.authData.userimage = imagebackup;
                        });
                }
            });
        });
    }

    get editstyle() {
        return {
            opacity: this.showEdit ? 1 : 0
        };
    }

    get userimage() {
        return this.session.authData.userimage;
    }

    private onMouseEnter() {
        this.showEdit = true;
    }

    private onMouseLeave() {
        this.showEdit = false;
    }
}
