/**
 * @module ModuleSpiceTimeStream
 */
import {
    Component, OnDestroy,
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
    selector: 'spice-timestream',
    templateUrl: './src/include/spicetimestream/templates/spicetimestream.html'
})
export class SpiceTimestream implements OnDestroy {

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



    constructor(private language: language, private userpreferences: userpreferences, private modellist: modellist, private modelutilities: modelutilities, private metadata: metadata) {

        // subscribe to changes of the list type
        this.subscriptions.add(
            this.modellist.listType$.subscribe(newType =>
                this.handleListTypeChange(newType)
            )
        );

        this.modellist.getListData();

    }

    /**
     * make sure we cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    private handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'SpiceTimestream') return;
        this.modellist.reLoadList();
    }

}
