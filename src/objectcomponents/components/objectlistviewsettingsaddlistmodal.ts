/**
 * Created by christian on 08.11.2016.
 */
import {Component, Input, OnInit} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-settings-addlist-modal',
    templateUrl: './app/objectcomponents/templates/objectlistviewsettingsaddlistmodal.html'
})
export class ObjectListViewSettingsAddlistModal implements OnInit {
    @Input() modalmode: string = '';
    listname: string = '';
    globallist: boolean = false;

    self: any = {};
    modellist: any = {};

    constructor( private language: language) {

    }

    ngOnInit() {
        if (this.modalmode === 'edit') {
            this.listname = this.modellist.getListTypeName();
            this.globallist = this.modellist.getGlobal();
        }
    }

    close() {
        this.self.destroy()
    }

    canSave() {
        return !(this.listname.length > 0);
    }

    save() {
        if (this.listname.length > 0) {
            switch (this.modalmode) {
                case 'add':
                    this.modellist.addListType(this.listname, this.globallist).subscribe(res => {
                        this.close();
                    })
                    break;
                case 'edit':
                    this.modellist.updateListType({name: this.listname, global: this.globallist}).subscribe(res => {
                        this.close();
                    })
                    break;
            }
        }
    }
}