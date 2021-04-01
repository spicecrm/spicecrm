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
 * @module SystemComponents
 */
import {Component, Input, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {helper} from "../../services/helper.service";

/**
 * renders a document type icon for the proper filetype
 */
@Component({
    selector: "system-file-icon",
    templateUrl: "./src/systemcomponents/templates/systemfileicon.html"
})
export class SystemFileIcon implements OnInit {
    /**
     * thze mime type or type of the file
     */
    @Input() private filemimetype: string = "";

    /**
     * the name of the file
     */
    @Input() private filename: string = "";

    /**
     * the size fo the icon
     */
    @Input() private size: '' | 'large' | 'small' | 'x-small' | 'xx-small' = '';

    /**
     * additonal classes
     */
    @Input() private addclasses: string = "";

    /**
     * the default div class
     */
    @Input() private divClass = "slds-media__figure";

    /**
     * the fileicon as determined
     */
    private fileicon: any = {icon: 'unknown', sprite: 'doctype'};

    constructor(private metadata: metadata, private helper: helper) {

    }

    /**
     * determine the icon on load
     */
    public ngOnInit(): void {
        this.determineIcon();
    }

    /**
     * determine the file icon
     */
    private determineIcon() {
        let icon = this.helper.determineFileIcon(this.filemimetype);
        if (icon == 'unknown') {
            let nameparts = this.filename.split('.');
            let type = nameparts.splice(-1, 1)[0];
            switch (type.toLowerCase()) {
                case 'msg':
                    this.fileicon = {
                        icon: 'email',
                        sprite: 'standard'
                    };
                    return;
                default:
                    break;
            }
        }
        this.fileicon = {
            icon: icon,
            sprite: 'doctype'
        };
    }

}
