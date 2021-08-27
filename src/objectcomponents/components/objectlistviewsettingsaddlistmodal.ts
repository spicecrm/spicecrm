/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {session} from "../../services/session.service";
import {modellist} from "../../services/modellist.service";

@Component({
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingsaddlistmodal.html'
})
export class ObjectListViewSettingsAddlistModal implements OnInit {

    /**
     * the mode
     */
    @Input() private modalmode: 'edit'|'add' = 'add';

    /**
     * the name to be used to bind to the input field
     */
    private listname: string = '';

    /**
     * binds to the global flag
     */
    private globallist: boolean = false;

    /**
     * holds the list component name
     */
    private listcomponent: string;

    /**
     * reference to the modal self to enable closing it
     */
    private self: any = {};

    public componentListOptions: Array<{label: string, component: string}> = [];

    constructor(
        private language: language,
        private session: session,
        private modellist: modellist
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
    private loadComponentListOptions() {
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
    private close() {
        this.self.destroy();
    }

    /**
     * checks if the list can be saved
     */
    private canSave() {
        return !(this.listname.length > 0);
    }

    /**
     * returns if the user is an admin and thus can set the global flag
     */
    get isadmin() {
        return this.session.isAdmin;
    }

    /**
     * save the list with the modellist service
     */
    private save() {
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
