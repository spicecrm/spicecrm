import {Component, OnInit} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'prospect-list-count-field',
    templateUrl: '../templates/prospectlistcountfield.html'
})

export class ProspectListCountField extends fieldGeneric implements OnInit {
    /**
     * is loading flag
     */
    public isLoading: boolean = false;

    /**
     * get the prospect list entries count
     */
    public ngOnInit() {
        super.ngOnInit();

        this.isLoading = true;

        this.model.backend.getRequest(`module/ProspectLists/${this.model.id}/count`).subscribe({
            next: count => {
                this.value = count;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}