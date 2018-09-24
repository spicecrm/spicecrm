
import {Router} from "@angular/router";
import {Component, ViewChild, ViewContainerRef, Renderer} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {popup} from "../../services/popup.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {configurationService} from "../../services/configuration.service";
import { modal } from "../../services/modal.service";
import {cookie} from "../../services/cookie.service";

@Component({
    selector: "global-user-panel",
    templateUrl: "./src/globalcomponents/templates/globaluserpanel.html",
})
export class GlobaUserPanel {

    @ViewChild("imgupload", {read: ViewContainerRef}) public imgupload: ViewContainerRef;

    constructor(
        private rendered: Renderer,
        private loginService: loginService,
        private session: session,
        private router: Router,
        private popup: popup,
        private language: language,
        private metadata: metadata,
        private footer: footer,
        private config: configurationService,
        private modalservice: modal,
        private cookie: cookie,
    ) {

    }

    private logoff() {
        this.loginService.logout()
    }

    private changeImage() {
        let event = new MouseEvent("click", {bubbles: true});
        this.rendered.invokeElementMethod(this.imgupload.element.nativeElement, "dispatchEvent", [event]);
    }

    private getAvialableLanguages(){
        return this.language.getAvialableLanguages(true);
    }

    get displayName(){
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    get userName(){
        return this.session.authData.userName;
    }

    get currentlanguage(){
        return this.language.currentlanguage;
    }

    set currentlanguage(value){
        this.popup.close();
        this.language.currentlanguage = value;
        this.language.loadLanguage();
    }

    private goDetails() {
        this.popup.close();
        this.router.navigate(["/module/Users/" + this.session.authData.userId]);
    }

    private changePassword() {
        this.modalservice.openModal("UserChangePasswordModal");
    }
}
