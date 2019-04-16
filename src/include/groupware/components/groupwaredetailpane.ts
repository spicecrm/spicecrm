import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

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
     * boolean indicator that the component is loading
     */
    private loading: boolean = false;

    /**
     * the componentset found and to be rendered to view the details
     */
    private componentset: string;

    private componentconfig: any = {};

    constructor(
        private groupware: GroupwareService,
        private model: model,
        private metadata: metadata,
        private language: language
    ) {
    }

    /**
     * triggers the loader and if one record is found opens that one
     */
    public ngOnInit(): void {
        this.loading = true;

        this.groupware.loadLinkedBeans().subscribe(
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

    private selectBean(bean) {
        this.loadRecord(bean.module, bean.id);
    }

    /**
     * loads a selected bean and shows its details
     *
     * @param module
     * @param id
     */
    private loadRecord(module, id) {

        // load te model
        this.model.module = module;
        this.model.id = id;
        this.model.getData(true);

        // load the componentset
        this.componentconfig = this.metadata.getComponentConfig('GroupwareDetailPane', module);
        // this.componentset = this.metadata.getComponentConfig('GroupwareDetailPane', module).componentset;
    }

    get beans() {
        return this.groupware.relatedBeans;
    }
}
