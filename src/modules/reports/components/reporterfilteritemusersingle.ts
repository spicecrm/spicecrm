/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'reporter-filter-item-user-single',
    templateUrl: './src/modules/reports/templates/reporterfilteritemusersingle.html'
})
export class ReporterFilterItemUserSingle implements OnInit {
    /**
     * @input whereCondition: object
     */
    @Input() private whereCondition: any = {};
    /**
     * @input fieldName: string
     */
    @Input() private fieldName: string;

    private activeUserName: string = '';

    constructor(private language: language, private modal: modal, private session: session) {
    }

    /**
     * @return activeUser: boolean
     */
    get activeUser() {
        return this.whereCondition.value.indexOf('current_user_id') > -1;
    }

    /**
     * add/remove active user from the value by checkbox value
     * @param value: boolean
     */
    set activeUser(value) {
        this.value = !value ? [''] : ['current_user_id'];
    }

    /**
     * @return value: string
     */
    get value() {
        return this.whereCondition.value;
    }

    /**
     * set whereCondition.value and valueinit
     * @param value: string
     */
    set value(value) {
        if (!value || value.length == 0) return;

        this.whereCondition.valuekey = value[0];
        this.whereCondition.value = value[0];
    }

    /**
     * set the activeUserName
     */
    public ngOnInit() {
        this.activeUserName = this.session.authData.userName;
    }

    /**
     * clear relate fields
     */
    private clearField() {
        this.whereCondition.value = '';
        this.whereCondition.valuekey = '';
    }

    /**
     * opens module lookup modal
     */
    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.value = items.map(u => u.user_name);
                }
            });
        });
    }
}
