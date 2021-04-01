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
 * @module ModuleMailboxes
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import {language} from "../../../services/language.service";

@Component({
    selector: "mailbox-email-to-lead-emailtext",
    templateUrl: "./src/modules/mailboxes/templates/mailboxemailtoleademailtext.html",
})
export class MailboxEmailToLeadEmailText implements OnDestroy {

    @ViewChild("contextMenu", {read: ViewContainerRef, static: true}) contextMenu: ViewContainerRef;

    @Input() public emailtext: string = "";
    @Input() public emailhtml: string = "";
    @Input() public emailmodule: string = "";
    @Input() public emailfields: Array<string> = ["first_name", "last_name"];

    @Output() public setfield: EventEmitter<any> = new EventEmitter<any>();

    public clickListener: any = null;
    public displayContextMenu: boolean = false;
    public displayContextCoordinates: any = {top: 0, left: 0};

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {
    }

    get content() {
        return this.emailhtml ? this.emailhtml : this.emailtext;
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public showContextMenu(event) {
        if (this.selectedText) {
            // prevent the browser context Menu
            event.preventDefault();

            // show the options
            this.displayContextMenu = true;
            this.displayContextCoordinates.top = event.clientY;
            this.displayContextCoordinates.left = event.clientX;

            // set a clicklistener
            this.clickListener = this.renderer.listen(
                "document", "click",
                (event) => this.onClick(event),
            );
        }
    }

    get selectedText() {
        let selected = window.getSelection().toString();

        return selected ? selected.trim() : "";
    }

    get contextMenuStyle() {
        let frameCoords = this.elementRef.nativeElement.getBoundingClientRect();
        let stylecoords = {
            left: this.displayContextCoordinates.left - frameCoords.left + "px",
            top: this.displayContextCoordinates.top - frameCoords.top + "px",
        };
        return stylecoords;
    }

    public onClick(event: MouseEvent): void {
        if (!this.contextMenu.element.nativeElement.contains(event.target)) {
            this.displayContextMenu = false;
            if (this.clickListener) {
                this.clickListener();
                this.clickListener = null;
            }
        }
    }

    public setField(field) {
        this.displayContextMenu = false;
        if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
        }

        this.setfield.emit({field: field, value: this.selectedText});
    }

}