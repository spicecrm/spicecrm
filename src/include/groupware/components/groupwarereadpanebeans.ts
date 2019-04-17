import {Component, ChangeDetectorRef} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../services/groupware.service';

import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'groupware-read-pane-beans',
    templateUrl: './src/include/groupware/templates/groupwarereadpanebeans.html'
})
export class GroupwareReadPaneBeans {

    private beans: any[] = [];

    constructor(
        private http: HttpClient,
        private groupware: GroupwareService,
        private backend: backend,
        private language: language
    ) {
        this.loadLinkedBeans();
    }


    public loadLinkedBeans() {
        let payload = this.groupware.getEmailAddressData();

        this.backend.postRequest('EmailAddress/searchBeans', {}, payload).subscribe(
            (res: any) => {
                for (let item in res) {
                    this.beans.push(res[item]);
                }

                // this.beansloaded$.emit(true);
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
