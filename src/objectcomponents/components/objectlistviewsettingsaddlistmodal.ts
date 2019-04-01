/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {session} from "../../services/session.service";

@Component({
    selector: 'object-listview-settings-addlist-modal',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingsaddlistmodal.html'
})
export class ObjectListViewSettingsAddlistModal implements OnInit {
    @Input() private modalmode: string = '';
    private listname: string = '';
    private globallist: boolean = false;

    private self: any = {};
    private modellist: any = {};

    constructor(
        private language: language,
        private session: session,
    ) {}

    public ngOnInit() {
        if (this.modalmode === 'edit') {
            this.listname = this.modellist.getListTypeName();
            this.globallist = this.modellist.getGlobal();
        }
    }

    private close() {
        this.self.destroy();
    }

    private canSave() {
        return !(this.listname.length > 0);
    }

    private save() {
        if (this.listname.length > 0) {
            switch (this.modalmode) {
                case 'add':
                    this.modellist.addListType(this.listname, this.globallist).subscribe(res => {
                        this.close();
                    });
                    break;
                case 'edit':
                    this.modellist.updateListType({name: this.listname, global: this.globallist}).subscribe(res => {
                        this.close();
                    });
                    break;
            }
        }
    }
}
