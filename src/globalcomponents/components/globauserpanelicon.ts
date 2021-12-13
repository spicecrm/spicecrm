/**
 * @module GlobalComponents
 */
import {Component} from "@angular/core";
import {session} from "../../services/session.service";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";

/**
 * displays the gluoab user panel icon that also allows editing of the image by the user
 */
@Component({
    selector: "global-user-panel-icon",
    templateUrl: "../templates/globaluserpanelicon.html",
})
export class GlobaUserPanelIcon {

    /**
     * transition if the edit icon is shown
     */
   public showEdit: boolean = false;

    constructor(
       public session: session,
       public modalservice: modal,
       public backend: backend
    ) {

    }

    /**
     * renders the upload modal to allow the user to change the image
     */
   public changeImage() {
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

    /**
     * returns the style with the opacity for the layover
     */
    get editstyle() {
        return {
            opacity: this.showEdit ? 1 : 0
        };
    }

    /**
     * returns the userimage from the session if the user has one maintained
     */
    get userimage() {
        return this.session.authData.userimage;
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
}
