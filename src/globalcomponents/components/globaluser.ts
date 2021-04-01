/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
