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
     * reference to the modal self to enable closing it
     */
    private self: any = {};

    constructor(
        private language: language,
        private session: session,
        private modellist: modellist
    ) {
    }

    public ngOnInit() {
        if (this.modalmode === 'edit') {
            this.listname = this.modellist.getListTypeName();
            this.globallist = this.modellist.getGlobal();
        }
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
            switch (this.modalmode) {
                case 'add':
                    this.modellist.addListType(this.listname, this.globallist ? '1' : '0').subscribe(res => {
                        this.close();
                    });
                    break;
                case 'edit':
                    this.modellist.updateListType({name: this.listname, global: this.globallist ? '1' : '0'}).subscribe(res => {
                        this.close();
                    });
                    break;
            }
        }
    }
}
