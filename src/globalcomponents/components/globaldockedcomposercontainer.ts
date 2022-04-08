/**
 * @module GlobalComponents
 */
import {
    Component,
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {telephony} from '../../services/telephony.service';

/**
 * the container in teh footer for the global docked composers
 */
@Component({
    selector: 'global-docked-composer-container',
    templateUrl: '../templates/globaldockedcomposercontainer.html',
    host: {
        '[class.slds-docked_container]': 'isVisible',
        'style': 'z-index: 9999'
    }
})
export class GlobalDockedComposerContainer {

    constructor(public dockedComposer: dockedComposer,public telephony: telephony) {

    }

    /**
     * a getter dto determine if the composer is visible at all.
     * if there are no composers the composer is hidden since it causes issues with the clickability of elements at the bottom
     */
    get isVisible() {
        return this.dockedComposer.composers.length > 0 || this.telephony.calls.length > 0;
    }

    /**
     * function to return the style if multiple composers are shown .. to stack them
     *
     * @param composerindex the index of the composer
     */
   public getComposerStyle(composerindex): any {
        if (composerindex >= this.dockedComposer.maxComposers - this.telephony.calls.length) {
            return {
                display: 'none'
            };
        }
    }

    /**
     * a simple getter to determine if the overflow shoudl be shown
     */
    get displayOverflow(): boolean {
        return this.dockedComposer.composers.length + this.telephony.calls.length > this.dockedComposer.maxComposers ? true : false;
    }
}
