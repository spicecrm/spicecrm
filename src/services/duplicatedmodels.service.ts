/**
 * @module services
 */
import {Injectable} from "@angular/core";
import {broadcast} from "./broadcast.service";
import {backend} from "./backend.service";
import {metadata} from "./metadata.service";
import {toast} from "./toast.service";
import {language} from './language.service';
import {model} from "./model.service";
import {Subject} from "rxjs";
import {relatedmodels} from "./relatedmodels.service";

declare var _;

/**
 * @ignore
 */
declare var moment: any;

/**
 * handles duplicated models for subpanels etc.
 */
@Injectable()
export class duplicatedmodels {

    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('duplicated_items_http_ref_');

    /**
     * indicates to show the panel
     * it is hidden if no dup check is done for the module or if no duplicates are found
     */
    public showPanel: boolean = false;

    /**
     * holds accepted duplicates
     * with status accepted
     */
    public acceptedDuplicates: any = [];

    /**
     * holds duplicates
     * with status found
     */
    public foundDuplicates: any = [];

    /**
     * shows/hides accepted duplicate Beans in the panel/list
     */
    public selectedStatus: string = 'all';

    constructor(
        public metadata: metadata,
        public model: model,
        public relatedmodels: relatedmodels,
        public backend: backend,
        public broadcast: broadcast,
        public toast: toast,
        public language: language
    ) {
    }

    /**
     * retrieves duplicate Beans from backend
     */
    public checkDuplicates() {
        let retSubject = new Subject<any>();

        this.relatedmodels.isloading = true;

        this.model.duplicateCheck().subscribe({
            next: (data) => {
                // save duplicate checked ids in a separate array
                this.acceptedDuplicates = [...data.acceptedDuplicates];

                this.foundDuplicates = [...data.foundDuplicates];

                this.showDuplicatesByStatus(this.selectedStatus);

                retSubject.next(true);
                retSubject.complete();

                // if we have duplicates show the panel
                if (this.foundDuplicates?.length > 0 || this.acceptedDuplicates?.length > 0) this.showPanel = true;
                this.relatedmodels.isloading = false;
            }, error: () => {
                this.relatedmodels.isloading = true;
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });

        return retSubject.asObservable();
    }

    /**
     * manages the visibility of duplicates
     * value: 'accepted' | 'found' | 'all
     */
    public showDuplicatesByStatus(value: string) {
        if (value === 'accepted') {
            this.relatedmodels.items = this.acceptedDuplicates;
        } else if(value === 'found'){
            this.relatedmodels.items = this.foundDuplicates;
        } else {
            this.relatedmodels.items = [...this.acceptedDuplicates].concat([...this.foundDuplicates]);
        }
    }
}

