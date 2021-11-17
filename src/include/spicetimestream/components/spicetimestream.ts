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
 * @module ModuleSpiceTimeStream
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy, OnInit
} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {language} from '../../../services/language.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-timestream',
    templateUrl: './src/include/spicetimestream/templates/spicetimestream.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceTimestream implements OnInit, OnDestroy {

    /**
     * holds the various subscriptions
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();


    /**
     * the timestream object
     *
     * @private
     */
    private timestream: any = {
        period: 'y',
        dateStart: null,
        dateEnd: null,
    };



    constructor(
        private language: language,
        private userpreferences: userpreferences,
        private modellist: modellist,
        public cdRef: ChangeDetectorRef
    ) {

        // subscribe to changes of the list type
        this.subscriptions.add(
            this.modellist.listType$.subscribe(newType =>
                this.handleListTypeChange(newType)
            )
        );


        this.subscriptions.add(
            this.modellist.listDataChanged$.subscribe(() => {
                this.cdRef.detectChanges();
            })
        );

        // this.modellist.getListData();

    }

    public ngOnInit() {
        // set the buckets to null
        this.modellist.buckets = {};

        if (!this.modellist.loadFromSession()) {
            this.getListData();
        }
    }

    /**
     * make sure we cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * trigger get list data on the service if autoload is not disabled and the list type is not "all" or reset the list data
     * @private
     */
    private getListData() {
        if (this.modellist.currentList.id != 'all') {
            this.modellist.getListData().subscribe(() =>
                this.cdRef.detectChanges()
            );
        } else {
            this.modellist.resetListData();
        }
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    private handleListTypeChange(newType: ListTypeI) {
        this.cdRef.detectChanges();
        if (newType.listcomponent != 'SpiceTimestream') return;
        this.getListData();
    }

}
