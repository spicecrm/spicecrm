import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'groupware-read-pane-search',
    templateUrl: './src/include/groupware/templates/groupwarereadpanesearch.html'
})
export class GroupwareReadPaneSearch {
    private searchTerm: string = "";
    private beans: any[] = [];
    private searchResults: any[] = [];

    private searching: boolean = false;

    private searchTimeOut: any = undefined;

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
        private http: HttpClient,
    ) {

    }

    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                if (this.searchTerm.length) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.searchSpice();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.searchSpice(), 1000);
                break;
        }
    }


    private searchSpice() {
        this.searching = true;
        this.searchResults = [];

        let searchParams = {
            aggregates: {},
            modules: "",
            owner: false,
            records: 10,
            searchterm: this.searchTerm,
            sort: {},
        };

        this.backend.postRequest('emails/search', {}, searchParams).subscribe(
            (res: any) => {
                this.searchResults = res;
                this.searching = false;
            },
            (err) => {
                this.searching = false;
            }
        );
    }
}
