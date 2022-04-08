/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'reporter-filter-item-user-multiple',
    templateUrl: '../templates/reporterfilteritemusermultiple.html'
})
export class ReporterFilterItemUserMultiple implements OnInit {
    /**
     * @input whereCondition: object
     */
    @Input() public whereCondition: any = {};
    /**
     * @input fieldName: string
     */
    @Input() public fieldName: string;

    public activeUserName: string = '';

    constructor(public language: language, public modal: modal, public session: session) {
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
        if (!value) {
            this.value = this.whereCondition.value.filter(u => u != 'current_user_id').slice();
        } else {
            this.value = [...this.whereCondition.value, 'current_user_id'];
        }
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

        this.whereCondition.value = value;
        this.whereCondition.valueinit = value.join(',');
    }

    /**
     * set the fieldName from path
     */
    public ngOnInit() {
        this.activeUserName = this.session.authData.userName;
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item;
    }

    /**
     * remove user from value
     * @param username
     */
    public removeUser(username) {
        this.value = this.whereCondition.value.filter(u => u != username).slice();
    }

    /**
     * opens module lookup modal
     */
    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.value = items.map(u => u.user_name);
                }
            });
        });
    }
}
