
import {Router} from '@angular/router';
import {Component, ViewChild, ViewContainerRef, Renderer} from '@angular/core';
import {loginService} from '../../services/login.service';
import {session} from '../../services/session.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {footer} from '../../services/footer.service';
import {configurationService} from "../../services/configuration.service";
import {UserChangePasswordModal} from "../../modulecomponents/components/userchangepasswordmodal";
import { modal } from '../../services/modal.service';
import {cookie} from '../../services/cookie.service';

@Component({
    selector: 'global-user-panel',
    templateUrl: './src/globalcomponents/templates/globaluserpanel.html',
})
export class GlobaUserPanel {

    @ViewChild('imgupload', {read: ViewContainerRef}) imgupload: ViewContainerRef;

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

    logoff() {
        this.loginService.logout()
    }

    goAdmin(){
        this.popup.close();
        this.router.navigate(['/admin']);
    }

    changeImage(){
        let event = new MouseEvent('click', {bubbles: true});
        this.rendered.invokeElementMethod(this.imgupload.element.nativeElement, 'dispatchEvent', [event]);
    }

    uploadImage($event){
        //console.log('upload');
    }

    getAvialableLanguages(){
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

    goDetails(){
        this.popup.close();
        this.router.navigate(['/module/Users/' + this.session.authData.userId]);
    }

    changePassword(){
        this.modalservice.openModal('UserChangePasswordModal');
    }
}
