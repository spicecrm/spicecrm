/**
 * @module ModuleProjects
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modellist} from '../../../services/modellist.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "project-activity-dashlet",
    templateUrl: "./src/modules/projects/templates/projectactivitydashlet.html",
    providers: [modellist]
})
export class ProjectActivityDashlet implements OnInit {
    // private recent_project_activities: any = [];
    private module: string = 'ProjectActivities';

    /**
     * the subscription to the modellist
     */
    private modellistsubscribe: any = undefined;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};


    /**
     * all fields that are available
     */
    // private allFields: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view,
        private backend: backend,
        private toast: toast,
        private modellist: modellist
    ) {

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ProjectActivityDashlet');

        // set modellist config
        this.modellist.loadlimit = this.limit;
        this.modellist.initialize(this.module);
        if(!this.modellist.currentList.sortfields) {
            this.modellist.currentList.sortfields = btoa('{"sortfield": "' + this.sortfield + '" , "sortdirection": "' + this.sortdirection + '"}');
        }

        // load the list and initialize from session data if this is set
        // this.loadRecentActivities();
    }

    public ngOnInit() {
        // load the last activities entered
        this.loadRecentActivities();
    }


    /**
     * returns the sortfield from the config
     */
    get sortfield() {
        if(this.componentconfig?.sortfield && this.componentconfig.sortfield !== '') {
            return this.componentconfig.sortfield;
        }
        return 'date_entered';
    }

    /**
     * returns the sortdirection from the componentconfig
     */
    get sortdirection() {
        if(this.componentconfig?.sortdirection && this.componentconfig.sortdirection !== '') {
            return this.componentconfig.sortdirection ;
        }
        return 'desc';
    }

    /**
     * returns the limit from the componentconfig
     */
    get limit() {
        if(this.componentconfig?.limit !== undefined) {
            return this.componentconfig.limit;
        }
        return 10;
    }

    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    /**
     * trackby function to optimize performance on the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     *
     * @param loadfromcache
     */
    private loadRecentActivities() {
        this.modellist.setListType('owner', false, [{sortfield: this.sortfield, sortdirection: this.sortdirection}]);
        this.modellist.getListData();
    }
}
