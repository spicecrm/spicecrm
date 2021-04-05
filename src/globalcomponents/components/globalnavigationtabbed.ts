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
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation, objectTab} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbed.html',
})
export class GlobalNavigationTabbed {

    public activetab: objectTab;

    constructor(private metadata: metadata, private navigation: navigation) {
        this.navigation.activeTab$.subscribe(tabid => {
            if (tabid == 'main') {
                this.activetab = this.navigation.maintab;
            } else {
                this.activetab = this.navigation.getTabById(tabid);
            }
        });
    }

    /**
     * returns the parent tab
     */
    get parenttab() {
        return this.activetab.parentid ? this.navigation.getTabById(this.activetab.parentid) : this.activetab;
    }

    /**
     * do not show when no subtabs are enables or tab is main (main has no subtabs at this point in time
     */
    get displaySubtabs() {
        return this.navigation.navigationparadigm == 'subtabbed' && this.activetab && (this.activetab.parentid || this.navigation.getSubTabs(this.activetab.id).length > 0);
    }
}
