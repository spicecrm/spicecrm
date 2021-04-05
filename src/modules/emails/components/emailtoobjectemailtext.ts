/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleEmails
 */
import {
    Component,
    Input,
    Output,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter, OnInit
} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: "email-to-object-emailtext",
    templateUrl: "./src/modules/emails/templates/emailtoobjectemailtext.html"
})
export class EmailToObjectEmailText implements OnDestroy, OnInit {

    @ViewChild("contextMenu", {read: ViewContainerRef, static: true}) public contextMenu: ViewContainerRef;

    @Input() public text: string = "";
    @Input() public html: string = "";
    @Input() public target_module_name: string = "";
    @Input() public target_module_fields = [];

    @Output() public setfield: EventEmitter<any> = new EventEmitter<any>();

    private clickListener: any = null;
    private displayContextMenu: boolean = false;
    private displayContextCoordinates: any = {top: 0, left: 0};
    private _striped_content: string;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private language: language,
        private metadata: metadata,
    ) {

    }

    get content(): string {
        return this.html ? this.html : this.text;
    }

    get striped_content(): string
    {
        if(this._striped_content) {
            return this._striped_content;
        }

        if(this.html) {
            this._striped_content = this.html
                .replace(/<!--.*?-->/gs, "")    // removes comments <!-- blabla -->
                .replace(/<[^>]+>/g,"")        // removes all kinds of tags
                .replace(/[ ]{2,}/g, " ").replace(/[\n\r]{3,}/g, "\n");
        } else {
            this._striped_content = this.text;
        }
        return this._striped_content;
    }

    public ngOnInit() {
        if(!this.target_module_fields || this.target_module_fields.length === 0) {
            let available_types: Array<string> = ["varchar", "text"];
            let field_defs = this.metadata.getModuleFields(this.target_module_name);
            //console.log(field_defs);
            for(let field in field_defs) {
                if(available_types.indexOf(field_defs[field].type) >= 0 && field_defs[field].vname && field_defs[field].name !== "id") {
                    this.target_module_fields.push(field);
                }
            }
        }
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private showContextMenu(event) {
        if (this.selectedText) {
            // prevent the browser context Menu
            event.preventDefault();

            // show the options
            this.displayContextMenu = true;
            this.displayContextCoordinates.top = event.clientY;
            this.displayContextCoordinates.left = event.clientX;

            // set a clicklistener
            this.clickListener = this.renderer.listen("document", "click", (clickevent) => this.onClick(clickevent));
        }
    }

    get selectedText() {
        let selected = window.getSelection().toString();

        return selected ? selected.trim() : "";
    }

    get contextMenuStyle() {
        let frameCoords = this.elementRef.nativeElement.getBoundingClientRect();
        let stylecoords = {
            top: this.displayContextCoordinates.top - frameCoords.top + "px",
            left: this.displayContextCoordinates.left - frameCoords.left + "px",
        };
        return stylecoords;
    }

    private onClick(event: MouseEvent): void {
        if (!this.contextMenu.element.nativeElement.contains(event.target)) {
            this.displayContextMenu = false;
            if (this.clickListener) {
                this.clickListener();
                this.clickListener = null;
            }
        }
    }

    private setField(field) {
        this.displayContextMenu = false;
        if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
        }

        this.setfield.emit({field: field, value: this.selectedText});
    }

}
