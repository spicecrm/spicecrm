import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane',
    templateUrl: './src/include/groupware/templates/groupwaredetailpane.html',
    providers: [model]
})
export class GroupwareDetailPane implements OnInit {

    /**
     * found beans
     */
    private beans: any = [];

    /**
     * boolean indicator that the component is loading
     */
    private loading: boolean = false;

    /**
     * the componentset found and to be rendered to view the details
     */
    private componentset: string;

    private componentconfig: any = {};

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
        private http: HttpClient,
        private router: Router,
        private model: model,
        private metadata: metadata,
    ) {
    }

    /**
     * triggers the loader and if one record is found opens that one
     */
    public ngOnInit(): void {
        this.loading = true;

        this.loadBeans().subscribe(
            (res) => {
                if (res.length == 1) {
                    this.loadRecord(res[0].module, res[0].id);
                }
                this.loading = false;
            },
            (err) => {
                // todo logger service
                console.log(err);

                this.loading = false;
            }
        );
    }

    private loadBeans(): Observable<any> {
        let responseSubject = new Subject<any>();
        let payload = this.groupware.getEmailAddressData();

        this.backend.postRequest('EmailAddress/searchBeans', {}, payload).subscribe(
            (res: any) => {
                for (let item in res) {
                    this.beans.push(res[item]);
                }
                responseSubject.next(this.beans);
                responseSubject.complete();
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    private selectBean(bean) {
        this.loadRecord(bean.module, bean.id);
    }

    private loadRecord(module, id) {

        // load te model
        this.model.module = module;
        this.model.id = id;
        this.model.getData(true);

        // load the componentset
        this.componentconfig = this.metadata.getComponentConfig('GroupwareDetailPane', module);
        // this.componentset = this.metadata.getComponentConfig('GroupwareDetailPane', module).componentset;
    }
}
