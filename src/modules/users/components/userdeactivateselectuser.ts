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
 * @module ModuleUsers
 */
import {
    Component, Input, OnDestroy, EventEmitter, Output
} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * renders a tabbed view for body, header and footer of a template
 */
@Component({
    selector: 'user-deactivate-select-user',
    templateUrl: "./src/modules/users/templates/userdeactivateselectuser.html"
})
export class UserDeactivateSelectUser implements OnDestroy {


    /**
     * holds the components subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * the current selected item
     */
    private selectedItem: any;

    /**
     * an emitter for the userid
     */
    @Output() private  userid$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal) {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    get placeholder() {
        // return default placeholder
        return this.language.getModuleCombinedLabel('LBL_SEARCH', 'Users');
    }

    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = items[0];
                        this.userid$.emit(this.selectedItem.id);
                    }
                })
            );
        });
    }

    private clearField() {
        this.selectedItem = undefined;
    }

}
