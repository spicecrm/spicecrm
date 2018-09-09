
import {Router} from '@angular/router';
import {
    Component,
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {popup} from '../../services/popup.service';

@Component({
    selector: 'global-user',
    templateUrl: './src/globalcomponents/templates/globaluser.html',
    providers:[popup]
})
export class GlobalUser {

    clickListener: any;

    constructor(private loginService: loginService, private router: Router, private elementRef: ElementRef, private renderer: Renderer, private popup: popup) {
        popup.closePopup$.subscribe(close => {
            this.hideUserDetails = true;
        })
    }
    hideUserDetails: boolean = true;

    toggleUserDetails(){
        this.hideUserDetails = !this.hideUserDetails;

        if(!this.hideUserDetails) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if(this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.hideUserDetails = true;
            this.clickListener();
        }
    }
}
