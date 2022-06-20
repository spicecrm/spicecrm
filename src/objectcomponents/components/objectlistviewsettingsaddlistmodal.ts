/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {session} from "../../services/session.service";
import {modellist} from "../../services/modellist.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'object-listview-settings-addlistmodal',
    templateUrl: '../templates/objectlistviewsettingsaddlistmodal.html'
})
export class ObjectListViewSettingsAddlistModal implements OnInit {

    /**
     * the mode
     */
    @Input() public modalmode: 'edit'|'add' = 'add';

    /**
     * the name to be used to bind to the input field
     */
    public listname: string = '';

    /**
     * binds to the global flag
     */
    public globallist: boolean = false;

    /**
     * holds the list component name
     */
    public listcomponent: string;

    /**
     * reference to the modal self to enable closing it
     */
    public self: any = {};

    public componentListOptions: {label: string, component: string}[] = [];

    constructor(
        public language: language,
        public session: session,
        public metadata: metadata,
        public modellist: modellist
    ) {
    }

    public ngOnInit() {
        this.loadComponentListOptions();
        if (this.modalmode === 'edit') {
            this.listname = this.modellist.currentList.name;
            this.globallist = this.modellist.getGlobal();
            this.listcomponent = this.modellist.currentList.listcomponent;
        }
    }

    /**
     * load the component config and build the list of the available component
     * @private
     */
    public loadComponentListOptions() {
        let config = this.modellist.metadata.getComponentConfig('ObjectListView', this.modellist.module);
        let items = this.modellist.metadata.getComponentSetObjects(config.componentset);
        this.componentListOptions = items.map(item => ({
                component: item.component,
                label: item.componentconfig.name
            }));
        this.listcomponent = this.componentListOptions[0].component;
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * checks if the list can be saved
     */
    public canSave() {
        return !(this.listname.length > 0);
    }

    /**
     * returns if the user is an admin and thus can set the global flag
     */
    get isadmin() {
        return this.session.isAdmin || this.metadata.checkModuleAcl(this.modellist.module, 'moduleadmin');
    }

    /**
     * save the list with the modellist service
     */
    public save() {
        if (this.listname.length > 0) {
            const listParams = {
                name: this.listname,
                listcomponent: this.listcomponent,
                global: this.globallist ? '1' : '0'
            };
            switch (this.modalmode) {
                case 'add':
                    this.modellist.addListType(listParams).subscribe(res => {
                        this.close();
                    });
                    break;
                case 'edit':
                    this.modellist.updateListType(listParams).subscribe(res => {
                        this.close();
                    });
                    break;
            }
        }
    }
}
