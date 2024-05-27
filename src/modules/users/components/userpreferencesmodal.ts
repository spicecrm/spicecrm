/**
 * @module ModuleUsers
 */
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {currency} from '../../../services/currency.service';
import {Subject, Subscription} from 'rxjs';
import {session} from '../../../services/session.service';
import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {metadata} from "../../../services/metadata.service";
import {
    AdministrationLoginRestrictionIpAddresses
} from '../../../admincomponents/components/administrationloginrestrictionipaddresses';
import {SystemPreferencesPanel} from '../../../systemcomponents/components/systempreferencespanel';
import {modal} from "../../../services/modal.service";

/** @ignore */
declare var _: any;

/**
 * render the user preferences
 */
@Component({
    selector: 'user-preferences-modal',
    templateUrl: '../templates/userpreferencesmodal.html',
    providers: [view]
})
export class UserPreferencesModal implements OnDestroy {
    public self: any;

    /**
     * holds the loaded preferences
     * @private
     */
    public preferences: any = {};
    /**
     * holds the names of the default preferences to be loaded
     * @private
     */
    public names = [
        'calendar_day_start_hour',
        'calendar_day_end_hour',
        'currency',
        'datef',
        'dec_sep',
        'currency_significant_digits',
        'export_charset',
        'locale_name_format',
        'distance_unit_system',
        'export_delimiter',
        'help_icon',
        'home_dashboard',
        'home_dashboardset',
        'home_assistant',
        'num_grp_sep',
        'reminder_time',
        'timef',
        'timezone',
        'week_day_start',
        'week_days_count',
    ];

    /**
     * holds an empty  dashboard to help set empty value for default dashboard
     * @private
     */
    public defaultDashboardPlaceHolder = {};

    /**
     * holds an empty  dashboardset to help set empty value for default dashboardset
     * @private
     */
    public defaultDashboardSetPlaceHolder = {};

    /**
     * holds the dashboard sets
     * @private
     */
    public dashboardSets: any[] = [];
    /**
     * holds the dashboard set data
     * @private
     */
    public dashboardSetData = {};
    /**
     * holds the home dashboard data
     * @private
     */
    public homeDashboardData: any = {};
    /**
     * holds the home dashboard data
     * @private
     */
    public homeDashboardSetData: any = {};
    /**
     * holds a list of available dashboards
     * @private
     */
    public dashboards: any[] = [];
    /**
     * holds a subscription to subscribe on preferences loaded
     * @private
     */
    public loadedSubscription = new Subject<string>();

    /**
     * inidcates if the preferences are being loaded
     */
    public isLoading: boolean = true;
    /**
     * holds the subscriptions to unsubscribe
     * @private
     */
    public subscriptions: Subscription;

    @ViewChild('systemPreferencesPanel') public systemPreferencesPanel: SystemPreferencesPanel;

    constructor(
        public backend: backend,
        public view: view,
        public toast: toast,
        public currency: currency,
        public modal: modal,
        public language: language,
        public preferencesService: userpreferences,
        public session: session,
        public broadcast: broadcast,
        public configuration: configurationService,
        public metadata: metadata) {

        this.loadInitialValues();

        this.view.setEditMode();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public close() {
        this.self.destroy();
    }

    /**
     * set the initial local list values
     * @private
     */
    public loadInitialValues() {
        this.view.isEditable = true;


        this.loadDasboardPlaceHolder();
        this.loadDashboardSetPlaceHolder();
        this.loadDashboardsLists();
        this.loadPreferences();


    }

    /**
     * load dashboard placeholder
     * to enable us set empty value for the home dashboard preference
     * @private
     */
    public loadDasboardPlaceHolder() {
        this.defaultDashboardPlaceHolder = {
            id: '',
            name: this.language.getLabel('LBL_ROLE_DEFAULT_DASHBOARD')
        };
    }

    /**
     * load dashboardset place Holder
     * to enable us set empty value for the home dashboardset preference
     * @private
     */
    public loadDashboardSetPlaceHolder() {
        this.defaultDashboardSetPlaceHolder = {
            id: '',
            name: this.language.getLabel('LBL_ROLE_DEFAULT_DASHBOARDSET')
        };
    }

    /**
     * load user preferences
     * @private
     */
    public loadPreferences() {
        this.subscriptions = this.loadedSubscription.subscribe({
            next: () => {
                this.isLoading = false;
                this.preferences = _.pick(this.preferencesService.unchangedPreferences.global, this.names);

                this.setHomeDashboardSetData(this.preferences.home_dashboardset);
                this.setHomeDashboardData(this.preferences.home_dashboard);
            }
        });
        this.preferencesService.getPreferences(this.loadedSubscription);
    }

    /**
     * loads dashboards and dashboard sets lists
     * @private
     */
    public loadDashboardsLists() {
        this.backend.getList('Dashboards', [{sortfield: 'name', sortdirection: 'DESC'}], {limit: -99})
            .subscribe((dashboards: any) => {
                // inject empty record for "default dashboard", add the rest
                this.dashboards = [].concat(this.dashboards, this.defaultDashboardPlaceHolder, dashboards.list);
                this.setHomeDashboardData(this.preferences.home_dashboard);
            });
        this.backend.getList('DashboardSets', [{sortfield: 'name', sortdirection: 'DESC'}], {limit: -99})
            .subscribe((dashboardSets: any) => {
                // inject empty record for "default dashboard", add the rest
                this.dashboardSets = [].concat(this.dashboardSets, this.defaultDashboardSetPlaceHolder, dashboardSets.list);
                this.setHomeDashboardSetData(this.preferences.home_dashboardset);
            });
    }

    /**
     * set the dashboard set data
     * @param value
     * @private
     */
    // public setDashboardSetData(value) {
    //     this.preferences.home_dashboardset = value;
    //     this.dashboardSetData = this.dashboardSets.find(dashboardSet => dashboardSet.id == value);
    // }

    /**
     * set the home dashboard data
     * @param value
     * @private
     */
    public setHomeDashboardData(value) {
        this.homeDashboardData = this.dashboards.find(dashboard => dashboard.id == value);
    }

    /**
     * set the home dashboardset data
     * @param value
     * @private
     */
    public setHomeDashboardSetData(value) {
        this.homeDashboardSetData = this.dashboardSets.find(dashboardSet => dashboardSet.id == value);
    }

    /**
     * save preferences changes
     * @private
     */
    public save() {
        let saveModal = this.modal.await('LBL_SAVING');
        this.preferencesService.setPreferences(this.preferences).subscribe({
            next: () => {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                this.preferences = _.pick(this.preferencesService.unchangedPreferences.global, this.names);

                // broadcast that the references have been saved
                this.broadcast.broadcastMessage('userpreferences.save');
                saveModal.emit(true);
                this.close();
            }
        });
    }
}
