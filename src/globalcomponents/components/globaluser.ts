/**
 * @module GlobalComponents
 */
import {Router} from '@angular/router';
import {
    Component,
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer2
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {session} from '../../services/session.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'global-user',
    templateUrl: '../templates/globaluser.html',
})
export class GlobalUser {

   public clickListener: any;
   public hideUserDetails: boolean = true;

    // The user preferences service is not needed in this component, but it has to get started (if not already elsewhere done).
    constructor(public loginService: loginService,public router: Router,public elementRef: ElementRef,public renderer: Renderer2,public session: session,public userpreferences: userpreferences) {

    }

   public toggleUserDetails() {
        this.hideUserDetails = !this.hideUserDetails;

        if (!this.hideUserDetails) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * closes the popup
     */
   public closepopup() {
        this.hideUserDetails = true;
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.hideUserDetails = true;
            this.clickListener();
        }
    }

    get userimage() {
        return this.session.authData.userimage;
    }
}
