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
    templateUrl: './src/globalcomponents/templates/globaluser.html',
})
export class GlobalUser {

    private clickListener: any;
    private hideUserDetails: boolean = true;

    // The user preferences service is not needed in this component, but it has to get started (if not already elsewhere done).
    constructor(private loginService: loginService, private router: Router, private elementRef: ElementRef, private renderer: Renderer2, private session: session, private userpreferences: userpreferences) {

    }

    private toggleUserDetails() {
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
    private closepopup() {
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
