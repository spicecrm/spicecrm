/**
 * @module ModuleSpiceTimeStream
 */
import {
    Component, Input, OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {language} from '../../../services/language.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-timestream-embedded',
    templateUrl: './src/include/spicetimestream/templates/spicetimestreamembedded.html'
})
export class SpiceTimestreamEmbedded implements OnDestroy {

    @Input() private module: string = '';

    /**
     * the items
     *
     * @private
     */
    @Input() private items: any = {};

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

    /**
     * holds the various subscriptions
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private userpreferences: userpreferences, private modelutilities: modelutilities, private metadata: metadata) {

    }

    /**
     * make sure we cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
