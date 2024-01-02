/**
 * @module services
 */
import {Injectable, EventEmitter, Injector, OnDestroy} from "@angular/core";
import {of, BehaviorSubject, Subject, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

import {session} from "./session.service";
import {modal} from "./modal.service";
import {navigation} from "./navigation.service";
import {language} from "./language.service";
import {modelutilities} from "./modelutilities.service";
import {toast} from "./toast.service";
import {broadcast} from "./broadcast.service";
import {metadata} from "./metadata.service";
import {backend} from "./backend.service";
import {recent} from "./recent.service";
import {configurationService} from "./configuration.service";
import {socket} from "./socket.service";
import {SocketEventI} from "./interfaces.service";
import {filter, map} from "rxjs/operators";
import {userpreferences} from "./userpreferences.service";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * @ignore
 */
declare var moment: any;
/**
 * @ignore
 */
declare var _: any;

interface fieldstati {
    editable: boolean;
    invalid: boolean;
    required: boolean;
    incomplete: boolean;
    disabled: boolean;
    hidden: boolean;
    readonly: boolean;
}

/**
 * for the save data emitter
 */
interface savedata {
    changed: any;
    backupdata: any;
}

export interface AddressRefMetadataI {
    id: string,
    parent_module: string,
    parent_address_key: string,
    parent_link_name: string,
    child_module: string,
    child_address_key: string,
    child_link_name: string,
}

/**
 * a generic service that handles the model instance. This is one of the most central items in SpiceUI as this is the instance of an object (record) in the backend. The service provides all relevant getters and setters for the data handling, it validates etc.
 */
@Injectable()
export class model implements OnDestroy {
    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     * @private
     */
    public httpRequestsRefID: string = _.uniqueId('model_http_ref_');
    /**
     * @ignore
     */
    public _module: string = "";

    /**
     * the id of the record in the backend held internally
     * this is get/set via a setter that also handels the model registry
     */
    public _id: string = "";

    /**
     * an object holding the acl data for the record as it is set in the backend
     */
    public acl: any = {};

    /**
     * an object holding the acl field control data
     */
    public acl_fieldcontrol: any = {};

    /**
     * the data object.
     *
     * ToDo: make a public property
     */
    public data: any = {};

    /**
     * a public element that holds a copy of the data and is created when the model is set to editmode. This is internal only and used for the assessment of dirty fields
     */
    public backupData: any = {};

    /**
     * an event emitter. this is called every time when a value to the model is set or the validation is changed. Otheer components can subscribe to this emitter and get the current data passed out in the event that a change occured
     *
     * ```typescript
     * constructor(public model: model) {
     *        this.model.data$.subscribe(data => {
     *            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
     *         });
     *}
     *```
     */
    public data$: BehaviorSubject<any>;

    /**
     * holds observable of a field and its value
     */
    public field$: BehaviorSubject<{ field: string, value: any }> = new BehaviorSubject({field: null, value: null});

    /**
     * indicates wheter the model is currently saving
     */
    public isSaving: boolean = false;

    /**
     * a simple event emitter that emits whenever the model is saved
     * this is used in views that also shoudl update when the model is saved. The pure data$ does not do that since data$ emils all data changes
     * the emitter emits  the changed data and the backupdate (a shallow copy thereof) in an object
     *
     * {
     *     changed: {}
     *     backupdata: {}
     * }
     */
    public saved$: EventEmitter<savedata> = new EventEmitter<savedata>();

    /**
     * an behaviour Subject that fires when te mode of the model changes between display and editing. Components can subscribe to this to get notified when the mode is triggerd by the application or by the user
     *
     * ```typescript
     * constructor(public model: model) {
     *        this.model.mode$.subscribe(mode => {
     *            this.handleDisabled(mode);
     *        });
     *}
     *```
     */
    public mode$: EventEmitter<'edit' | 'display'> = new EventEmitter();

    /**
     * fires when the editing of the model is cancelled
     */
    public canceledit$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * indicates if the model state is valid
     */
    public isValid: boolean = false;

    /**
     * indicates that the model is currently loading from the backend
     */
    public isLoading: boolean = false;

    /**
     * indicates that the current model is in an edit state
     */
    public isEditing: boolean = false;

    /**
     * for the navigate away check ... set when the model is added from a global component and thus is not tracked for th enavigate away action
     */
    public isGlobal: boolean = false;

    /**
     * set when a new record is created and teh model is not yet saved on the backend
     */
    public isNew: boolean = false;

    /**
     * @ignore
     *
     * @ToDo: add documentation
     */
    public _fields_stati: any = []; // will be build by initialization of the model

    /**
     * @ignore
     *
     * @ToDo: add documentation
     */
    public _fields_stati_tmp: any = []; // will be erased when evaluateValidationRules() is called

    /**
     * @ignore
     *
     * @ToDo: add documentation
     */
    public _model_stati_tmp: any = [];  // will be erased when evaluateValidationRules() is called

    /**
     * holds any collected messages during validation or propagation
     */
    public _messages: any = [];

    /**
     * @ToDo: add documentation
     */
    public reference: string = "";
    public _fields: any = [];
    public messageChange$ = new EventEmitter<boolean>();

    /**
     * indicating that the current model created is a duplicate. this avoids that the model when begin created, creates a new set of backupdata as this woudl limit the data being sent to the backend when saviong the model
     */
    public duplicate: boolean = false;

    /**
     * Holds the ID of the template model, in case the model is a duplicate.
     */
    public templateId: string = null;

    /**
     * inidctaes thata duplicate check is ongoing
     */
    public duplicateChecking: boolean = false;

    /**
     * an array with duplicates the duplicate check on the model returned
     */
    public duplicates: any[] = [];

    /**
     * can be set if the model is in teh context of a parent and thus allows to pass a parent model through the dom
     */
    public parentmodel: model;

    /**
     * the coiunt for the toal duplicates found
     */
    public duplicatecount: number = 0;

    /**
     * ToDo add documentation on how to use this
     */
    public modelRegisterId: number;

    /**
     * ToDo: add documentation how to use this
     */
    public savingProgress: BehaviorSubject<number> = new BehaviorSubject(1);

    /**
     * any subscriptions the service might have to be collected here
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * indicates that we had an error loading the modal and will retry on the proper event
     *
     * @private
     */
    public loadingError: boolean = false;

    /**
     * A simple event emitter that emits whenever the model has been validated.
     */
    public validated$: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public backend: backend,
        public broadcast: broadcast,
        public metadata: metadata,
        public utils: modelutilities,
        public session: session,
        public recent: recent,
        public router: Router,
        public toast: toast,
        public language: language,
        public modal: modal,
        public navigation: navigation,
        public configuration: configurationService,
        public injector: Injector,
        public socket: socket,
        public userpreferences: userpreferences,
        private sanitizer: DomSanitizer
    ) {

        this.data$ = new BehaviorSubject(this.data);

        this.subscriptions.add(
            this.broadcast.message$.subscribe(data => {
                if (data.messagetype === 'timezone.changed') {
                    this.utils.timezoneChanged(this.data, data.messagedata);
                    this.utils.timezoneChanged(this.backupData, data.messagedata);
                }

                // add a listener to reload if we dropped the connection on a 401 error and the user did relogin
                /*
                if (data.messagetype === 'relogin' && this.loadingError) {
                    this.loadingError = false;
                    this.getData();
                }
                */
            })
        );
    }

    /**
     * registers the model but only if id and module are set
     * otherwise it spams the model registry
     *
     * @private
     */
    public registerModel() {
        if (this.module && this._id && !this.navigation.modelregister.find(m => m.model._id == this._id && m.model.module == this.module)) {
            this.modelRegisterId = this.navigation.registerModel(this);
        }
    }

    get messages(): any[] {
        return this._messages;
    }

    /**
     * getter for the module
     */
    get module(): string {
        return this._module;
    }

    /**
     * setter for the module
     * also triggers inittialization of field statis as well as model registry
     *
     * @param val
     */
    set module(val: string) {
        this._module = val;
        this.initializeFieldsStati();
        this.registerModel();
        if (!val) return;
    }

    /**
     * helper to get the proper backend formatted model data
     */
    get backendData() {
        return this.utils.spiceModel2backend(this.module, this.data);
    }

    /**
     * getter for the id
     */
    get id() {
        return this._id;
    }

    /**
     * setter for teh id also triggers the registration of the model if module and id are set
     *
     * @param id
     */
    set id(id) {
        this._id = id;
        this.registerModel();
    }

    /*
    * a getter function to return a displayname
    * todo: make customizable so this can be defined in sysmodules
     */
    get displayname() {
        return this.getFieldValue('summary_text');
    }

    /**
     * return fields definitions loaded from metadata service
     */
    get fields(): any[] {
        if (this.module && _.isEmpty(this._fields)) {
            this._fields = this.metadata.getModuleFields(this.module);
        }

        return this._fields;
    }

    /**
     * a helper function that calls modelutilities generateGUID and returns a guid as used internally
     */
    public generateGuid(): string {
        return this.utils.generateGuid();
    }

    /*
     * meta data related functions
     */
    /**
     * queries the metadata and returns if the field is required by the metadata definitions of the bckend
     *
     * @param field the fieldname
     */
    public isFieldRequired(field: string): boolean {
        switch (field) {
            // wtf???
            case "date_entered":
            case "date_modified":
                return true;
            default:
                return this.metadata.getFieldRequired(this.module, field);
        }
    }

    /**
     * a shorthand function to [isFieldRequired]
     *
     * @param field the fieldname
     */
    public isRequired(field: string) {
        return this.isFieldRequired(field);
    }

    /**
     * checks the access right on the model instance and returns true or false
     *
     * @param access a strting with the access to be checked. Can be literally any acl string. standard are edit, display, list .. they are deifned in the backend
     */
    public checkAccess(access): boolean {
        // ToDo: clean this up and make view or detail in general
        if (access == 'detail' || access == 'view') {
            return this.acl.detail || this.acl.view;
        } else {
            return this.acl[access];
        }
    }

    /**
     * returns if access to a field is granted
     *
     * @param field the field to be checked
     */
    public checkFieldAccess(field): boolean {
        return !(this.acl_fieldcontrol && this.acl_fieldcontrol[field] && this.acl_fieldcontrol[field] == '1');
    }

    /**
     * returns the field access control data
     *
     * @param field the field to be checked
     */
    public getFieldAccess(field): number {
        return this.acl_fieldcontrol && this.acl_fieldcontrol[field] ? parseInt(this.acl_fieldcontrol[field], 10) : undefined;
    }

    /**
     * navigates to the detasil view route of the given model
     */
    public goDetail(tabid?: string) {
        if (this.checkAccess("detail")) {
            let objectlink = "/module/" + this.module + "/" + this.id;
            // if we have a tabid and it is not th emain tab add it
            if (tabid) objectlink = '/tab/' + tabid + '/' + objectlink;
            // navigate to the route
            this.router.navigate([objectlink]);
        } else {
            return false;
        }
    }

    /**
     * navigates to the listvioew of the module
     */
    public goModule() {
        this.router.navigate(["/module/" + this.module]);
    }


    /**
     * a central function that will load the model data from teh backend and transform it to the internal data formats. When sucessfully accomplished the Observable returned will be reolved with the data of the model
     *
     * @param resetData send true to reset all data already loaded and reload
     * @param trackAction the action that will be set in the tracker int he backend. This is relevant for the tracker histoy and the recently viewed records by the user. Leave empty if no tracking should be done
     * @param setLoading sets the isLoading paramater on the model and sets it back once the load is completed. This has an impact e.g. on the view service as this renders stencilc there ot other. If this is not to be done set to false then teh model will be loaded "silent"
     * @param redirectNotFound if set to true if the model is not found the userwill be redirected to the main moduel if the user has the proper access right or the home screen. Shoudl be passed in in e.g. a detail view but not in case of e.g. loading a related record.
     */
    public getData(resetData: boolean = true, trackAction: string = "", setLoading: boolean = true, redirectNotFound = false): Observable<any> {
        let responseSubject = new Subject<any>();

        if (resetData) {
            this.resetData();
        }

        // set laoding
        this.isLoading = setLoading;

        this.backend.get(this.module, this.id, trackAction, this.httpRequestsRefID).subscribe({
            next: (res) => {

                this.isLoading = false;

                // set data and acl
                this.data = res;
                this.acl = res.acl;
                this.acl_fieldcontrol = res.acl_fieldcontrol;

                if (trackAction != "") {
                    this.recent.trackItem(this.module, this.id, this.data);
                }
                this.initializeFieldsStati();
                this.evaluateValidationRules(null, 'initialize');
                this.emitFieldsChanges(res);
                this.data$.next(res);
                this.broadcast.broadcastMessage("model.loaded", {id: this.id, module: this.module, data: this.data});
                responseSubject.next(res);
                responseSubject.complete();
            },
            error: (err) => {
                if (redirectNotFound && err.status != 401) {
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR_LOADING_RECORD"), "error");
                    this.router.navigate(["/module/" + this.module]);
                }

                if (err.status == 401) {
                    this.loadingError = true;
                }
                responseSubject.error(err);
            }
        });
        return responseSubject.asObservable();
    }


    /**
     * validates the model
     * ToDo: Sebastian to add some more details
     *
     * @param event
     */
    public validate(event?: string) {
        this.resetMessages();
        this.isValid = true;

        // run evaluation rules again
        this.evaluateValidationRules(null, "change");

        for (let field in this.fields) {
            // check required
            if (
                field !== "id" && this.getFieldStati(field).required &&
                ((!this.data[field] && this.data[field] !== 0) || String(this.data[field]).length === 0)
            ) {
                this.isValid = false;
                this.addMessage("error", this.language.getLabel("MSG_INPUT_REQUIRED") + "!", field);
            }
            if (this.getFieldStati(field).invalid) {
                this.isValid = false;
            }
        }
        if (!this.isValid) {
            // console.warn("validation failed:", this.messages);
        }
        this.validated$.next();
        return this.isValid;
    }

    public initializeFieldsStati() {
        let stati = [];
        for (let field in this.fields) {
            stati[field] = this.evaluateFieldStati(field);
        }
        this._fields_stati = stati;
    }

    public getDefaultStati(): fieldstati {
        return {
            editable: this.checkAccess("edit"),
            invalid: false,
            required: false,
            incomplete: false,
            disabled: false,
            hidden: false,
            readonly: false,
        };
    }

    /**
     * evaluates the stati of a field by checking acl, required, errors etc...
     * @param {string} field
     * @returns {fieldstati}
     */
    public evaluateFieldStati(field: string) {
        let stati = this.getDefaultStati();

        // editable... acl check?!
        if (
            this.acl_fieldcontrol &&
            this.acl_fieldcontrol[field] &&
            parseInt(this.acl_fieldcontrol[field], 10) < 3
        ) {
            stati.editable = false;
        }

        if (this.isRequired(field)) {
            stati.required = true;
        }

        return stati;
    }

    public resetFieldStati(field: string) {
        this._fields_stati[field] = this.evaluateFieldStati(field);
        // tmp stati
        this._fields_stati_tmp[field] = {...this._fields_stati[field]};
        if (this.getFieldMessages(field, "error")) {
            this._fields_stati_tmp[field].invalid = true;
        }
    }

    /**
     * sets the field status
     *
     * @param field the name if the field
     * @param status the status to be set
     * @param value
     *
     */
    public setFieldStatus(field: string, status: 'editable' | 'invalid' | 'required' | 'incomplete' | 'disabled' | 'hidden' | 'readonly', value: boolean = true): boolean {
        try {
            let stati = this._fields_stati[field];
            if (stati[status] && !value) {
                console.warn("could not set status " + status + " to " + value + " because it has to be: " + stati[status]);
                return false;
            }
            switch (status) {
                case "required":
                    // check if not hidden...

                    break;
            }
            if (!this._fields_stati_tmp[field]) {
                // copy...
                this._fields_stati_tmp[field] = {...stati};
            }
            this._fields_stati_tmp[field][status] = value;
            return true;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    public setFieldStati(field: string, stati: object): boolean {
        for (let status in stati) {
            // @ts-ignore
            let result = this.setFieldStatus(field, status, stati[status]);
            if (!result) return false;
        }
        return true;
    }


    public getFieldStati(field: string) {

        let stati = this._fields_stati_tmp[field];
        if (!stati) {
            stati = this._fields_stati[field];
            if (!stati) {
                stati = this.getDefaultStati();
                this._fields_stati[field] = stati;
            }
        }
        /*
        if ( field == 'questionnaire ') {
            this._fields_stati[field].invalid = true;
        }

         */
        // copy stati to manipulate them without changing the stored ones...
        stati = {...stati};
        if (!stati.invalid && this.getFieldMessages(field, "error")) {
            stati.invalid = true;
        }

        return stati;
    }

    public evaluateValidationRules(field?: string, event?: string) {
        let validations = this.metadata.getModuleValidations(this.module);
        if (!validations) {
            return true;
        }

        // reset tmp stati to evaluate new...
        this._fields_stati_tmp = [];
        this._model_stati_tmp = [];
        this.resetMessages();

        // loop through validations...
        for (let validation of validations) {
            if(!validation.active) continue ;

            let checksum: number = 0;
            let is_valid: boolean = true;

            // make sure we have an array of events to filter properly on events
            let onEventCheck = validation.onevents instanceof Array;
            if(!onEventCheck){
                validation.onevents = validation.onevents.split(',');
            }

            if (validation.onevents instanceof Array && !validation.onevents.includes(event)) {
                continue;
            }

            if (validation.conditions instanceof Array) {
                // check conditions...
                for (let condition of validation.conditions) {
                    let result = false;
                    result = this.evaluateCondition(condition);
                    checksum += result ? 1 : 0;
                    if (
                        checksum > 0 &&
                        validation.logicoperator == "or"
                    ) {
                        // only one condition must be true, skip the rest...
                        is_valid = true;
                        break;
                    }
                }
            }

            if (
                validation.conditions &&
                validation.conditions.length > 1 &&
                validation.logicoperator == "and"
            ) {
                // all conditions must be true!
                if (checksum < validation.conditions.length) {
                    is_valid = false;
                }
            } else {
                if (checksum == 0 && validation.conditions) {
                    is_valid = false;
                }
            }

            if (!is_valid) {
                continue;
            }
            // do some actions...
            for (let action of validation.actions) {
                let result = this.executeValidationAction(action);
                if (!result) {
                    console.warn("Action " + action.action + " for " + action.fieldname + " failed!");
                }
            }
        }
    }

    public evaluateCondition(condition): boolean {
        let check: boolean = false;

        if (condition.comparator != 'empty' && typeof this.data[condition.fieldname] == undefined) {
            return false;
        }

        let val_left = this.data[condition.fieldname];
        let val_right: null;
        if (condition.comparator.match(/regex/g)) {
            val_right = condition.valuations;
        } else {
            val_right = this.evaluateValidationParams(condition.valuations);
        }

        check = modelutilities.compare(val_left, condition.comparator, val_right);

        /*
        console.log("checking: " + condition.fieldname + " " + condition.comparator + " " + condition.valuations,
            val_left + " " + condition.comparator + " " + val_right + " is " + check);
        */

        return check;
    }

    public executeValidationAction(action): boolean {
        // console.log("doing: " + action.action + " with " + action.params + " on " + action.fieldname);
        let params = this.evaluateValidationParams(action.params);
        switch (action.action) {
            case "set_value":
                this.data[action.fieldname] = params;
                return true;
            case "set_value_from_field":
                this.data[action.fieldname] = this.data[params];
                return true;
            case "set_value_from_user":
                if(this.session.authData.user[params]){
                    this.data[action.fieldname] = this.session.authData.user[params];
                } else if(this.userpreferences.toUse[params]){
                    this.data[action.fieldname] = this.userpreferences.toUse[params];
                }
                return true;
            case "set_message":
                if (params instanceof Object) {
                    this._messages.push(params);
                    this.messageChange$.emit(true);
                    return true;
                } else {
                    return false;
                }
            case "error":
                return this.addMessage("error", params, action.fieldname);
            case "warning":
                return this.addMessage("warning", params, action.fieldname);
            case "notice":
                return this.addMessage("notice", params, action.fieldname);
            case "hide":
                params = (typeof params == "string" ? modelutilities.strtobool(params) : params);
                return this.setFieldStatus(action.fieldname, "hidden", params);
            case "show":
                params = !(typeof params == "string" ? modelutilities.strtobool(params) : params);
                return this.setFieldStatus(action.fieldname, "hidden", params);
            case "require":
                params = (typeof params == "string" ? modelutilities.strtobool(params) : params);
                return this.setFieldStatus(action.fieldname, "required", params);
            case "set_stati":
                /*
                * params has to be an json string like this:
                {
                    "editable": true,
                    "invalid": false,
                    "required": false,
                    "incomplete": false,
                    "disabled": false,
                    "hidden": false,
                    "readonly": false,
                }
                */
                params = (typeof params == "string" ? JSON.parse(params) : params);
                return this.setFieldStati(action.fieldname, params);
            case "set_model_state":
                if (params instanceof Array) {
                    for (let state of params) {
                        if (!this.checkModelState(state)) {
                            this._model_stati_tmp.push(state);
                        }
                    }
                } else if (!this.checkModelState(params)) {
                    this._model_stati_tmp.push(params);
                }
                return true;
            default:
                console.warn("action: " + action.action + " is not defined!");
                return false;
        }
    }

    public evaluateValidationParams(params) {
        if (typeof params == "string") {
            // replace placeholders...
            if (/(\<[a-z\_]+\>)/.test(params)) {
                for (let match of params.match(/(\<[a-z\_]+\>)/g)) {
                    let attr = match.replace("<", "").replace(">", "");

                    let replace = this.data[attr] ? this.data[attr] : 0;
                    let defs = this.metadata.getFieldDefs(this.module, attr);
                    switch (defs.type) {
                        case "datetimecombo":
                        case "datetime":
                        case "date":
                            if (replace) replace = replace.format("YYYY-MM-DD HH:mm:ss");
                    }

                    params = params.replace(match, replace);
                }
            }
            // date manipulations...
            if (/\d+[\.\-]\d+[\.\-]\d+/.test(params) && /[\+\-]/.test(params)) {
                let result = modelutilities.strtomoment(params);
                params = result ? result : params;
            } else if (/\d+\s*[\+\-\*\/\^]\s*\d+/.test(params)) {
                // compile math expressions...
                let result = this.utils.compileMathExpression(params);
                params = result ? result : params;
            }
        }
        return params;
    }

    public checkModelState(state: string): boolean {
        return this._model_stati_tmp.includes(state);
    }

    /**
     * set the model to the edit mode
     *
     * @param withbackup create backup data so dirty fields can be evaluated. Defaults to true. Shoudl ony be set to false in specific cases
     * @param silent prevents the model to be set to editing
     */
    public startEdit(withbackup: boolean = true, silent: boolean = false) {
        // if the model is already editing .. simply return
        if (this.isEditing) return;

        // shift to backend format .. no objects like date embedded
        if (withbackup && !this.duplicate) {
            this.backupData = this.buildBackup(this.data);
        }

        /**
         *  do not set to editing if silent is set
         */
        if (!silent) {
            this.isEditing = true;
            this.mode$.emit('edit');
        }

        // add the model as editing to the navigation service so we can stop the user from navigating away
        this.navigation.addModelEditing(this.id, this.module, this, this.getFieldValue('summary_text'));
    }


    /*
    * returns the field value
    */
    public getFieldValue(field) {
        return this.data[field];
    }

    /*
    * short version to get the field value
    */
    public getField(field) {
        return this.getFieldValue(field);
    }

    /**
     * @deprecated
     * sets a single value on a field, also called from setField
     *
     * @param field
     * @param value
     */
    public setFieldValue(field, value) {
        return this.setField(field, value);
    }

    /**
     * initializes a single field on the model
     * similar to the setField but does not trigger the emitter and no duplicate check and no validation
     *
     * @param field
     * @param value
     */
    public initializeField(field, value) {
        if (!field) return false;
        this.data[field] = value;
    }

    /**
     * sets a single field on the model
     *
     * @param field
     * @param value
     * @param silent
     */
    public setField(field, value, silent: boolean = false) {
        if (!field) return false;

        const previousValue = this.data[field];
        this.data[field] = value;

        this.evaluateValidationRules(field, "change");

        if (previousValue !== value && !silent) {
            this.field$.next({field, value});
        }

        if (!silent) {
            this.data$.next(this.data);
        }

        // run the duplicate check
        this.duplicateCheckOnChange([field]);
    }

    /**
     * returns an observable for the given field name to subscribe on to track the field changes
     * @param field
     */
    public observeFieldChanges(field: string): Observable<any> {
        if (!this.fields[field]) return of(null);
        return this.field$.pipe(filter(fieldObj => fieldObj.field == field), map(v => v.value));
    }

    /**
     * sets an object of fields on a model
     *
     * @param fieldData a simple object with the fieldname and the value to be set
     * @param silent
     */
    public setFields(fieldData, silent: boolean = false) {
        let changedFields = [];
        for (let fieldName in fieldData) {
            if (!fieldData.hasOwnProperty(fieldName)) continue;
            let fieldValue = fieldData[fieldName];
            if (_.isString(fieldValue)) fieldValue = fieldValue.trim();
            if (this.data[fieldName] != fieldValue) {
                this.field$.next({field: fieldName, value: fieldValue});
            }
            this.data[fieldName] = fieldValue;
            changedFields.push(fieldName);
        }

        if (silent !== true) {
            this.data$.next(this.data);
        }
        this.evaluateValidationRules(null, "change");

        // run the duplicate check
        this.duplicateCheckOnChange(changedFields);
    }

    /**
     * emit fields changes from the data object
     * @param data
     * @private
     */
    public emitFieldsChanges(data) {
        for (let fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) continue;
            this.field$.next({field: fieldName, value: data[fieldName]});
        }
    }

    /**
     * cancels the editing process. Similar to end edit but the data is reset
     */
    public cancelEdit() {
        this.isEditing = false;
        this.navigation.removeModelEditing(this.module, this.id);

        if (this.backupData) {
            this.data = this.backupData;
            this.data$.next(this.data);
            this.backupData = null;
            // todo: evaluate all fields because they have changed back???
            this.resetMessages();
        }

        this.mode$.emit('display');
        // emit that the edit mode has been cancelled
        this.canceledit$.emit(true);
    }

    /**
     * called to end the editing process. This cleans up the backup data, sets editing to false and emits also that the model is no in display mode
     * this also removes the model from the editing list in teh va service. Avodiing that navigating away or closing the browser will prompt the user with a warning
     */
    public endEdit() {
        this.backupData = null;
        this.isEditing = false;
        this.mode$.emit('display');

        this.navigation.removeModelEditing(this.module, this.id);
    }

    /**
     * evaluates the dirty fields on a model based on the backupdata that is generated when the model is set to the edit mode
     */
    public getDirtyFields() {
        let d = {};
        for (let property in this.data) {
            // if (property && (!this.backupData || _.isObject(this.data[property]) || _.isArray(this.data[property]) || !_.isEqual(this.data[property], this.backupData[property]) || this.isFieldARelationLink(property))) {
            if (property && (!this.backupData || !_.isEqual(this.data[property], this.backupData[property]))) {
                d[property] = this.data[property];
            }
        }
        return d;
    }

    /**
     * saves the changes on the model
     *
     * @param notify if set to true a toast is sent once the save is completed (defaults to false)
     */
    public save(notify: boolean = false): Observable<boolean> {
        let responseSubject = new Subject<boolean>();

        // set to saving
        this.isSaving = true;

        // Clean strings of leading and ending white spaces:
        for (let property in this.data) {
            if (_.isString(this.data[property])) this.data[property] = this.data[property].trim();
        }

        // determine changed fields
        let changedData: any;
        if ((this.isEditing || !_.isEmpty(this.backupData)) && !this.isNew) {
            changedData = this.getDirtyFields();
            // in any case send back date_modified
            changedData.date_modified = this.data.date_modified;
        } else {
            changedData = this.data;
        }

        this.backend.save(this.module, this.id, changedData, this.savingProgress, this.templateId, this.httpRequestsRefID)
            .subscribe({
                next: (res) => {
                    this.data = res;
                    this.isNew = false;
                    this.data$.next(res);
                    this.broadcast.broadcastMessage("model.save", {
                        id: this.id,
                        reference: this.reference,
                        module: this.module,
                        data: this.data,
                        changed: this.getDirtyFields(),
                        backupdata: this.backupData
                    });

                    // saving is done
                    this.isSaving = false;

                    // if notification is on send a toast
                    if (notify) {
                        this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    }


                    // emit the save$
                    // redetermin the dirty fields since the backend call might have changed also additonal fields
                    this.saved$.emit({changed: this.getDirtyFields(), backupdata: this.backupData});


                    // end the edit process
                    this.endEdit();

                    // reinitialize the Field Stats in case ACL Changed
                    this.initializeFieldsStati();

                    // emit the observable
                    responseSubject.next(true);
                    responseSubject.complete();

                },
                error: (error) => {
                    // console.log(error);
                    switch (error.status) {
                        case 409:
                            this.modal.openModal("ObjectOptimisticLockingModal", false, this.injector).subscribe(lockingModalRef => {
                                lockingModalRef.instance.conflicts = error.error.error.conflicts;
                                lockingModalRef.instance.responseSubject = responseSubject;
                            });
                            break;
                        default:
                            if (notify) {
                                this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.lbl ? this.language.getLabel( error.error.error.lbl ) : error.error.error.message );
                            }
                            responseSubject.error(error);
                            responseSubject.complete();
                    }

                    // indicvate end of save process
                    this.isSaving = false;
                }
            });
        return responseSubject.asObservable();
    }

    public delete(): Observable<boolean> {
        let responseSubject = new Subject<boolean>();

        this.backend.deleteRequest(`module/${this.module}/${this.id}`, null, this.httpRequestsRefID).subscribe({
            next: () => {
                this.broadcast.broadcastMessage("model.delete", {
                    id: this.id,
                    module: this.module,
                    data: _.clone(this.data)
                });
                responseSubject.next(true);
                responseSubject.complete();
            },
            error: () => {
                responseSubject.error('unable to delete record');
            }
        });
        return responseSubject.asObservable();
    }


    /**
     * saves the changes on the model and sends it
     * Be aware that send functionality is triggered in backend within save logic itself
     * @param notify if set to true a toast is sent once the send is completed (defaults to false)
     * @param toastLabel
     */
    public saveAndSend(notify: boolean = false, toastLabel: string = 'LBL_DATA_SENT'): Observable<boolean> {
        let _notify = notify;
        let _observable = this.save(false);

        // if notification is on send a toast
        if (_notify) {
            this.toast.sendToast(this.language.getLabel(toastLabel) + ".", "success");
        }
        return _observable;
    }

    /**
     * resets all model"s data to a blank state
     */
    public reset() {
        this.id = null;
        this.module = null;
        this._fields_stati_tmp = this._fields_stati = [];
        this._fields = [];
        this.isLoading = false;
        this.isEditing = false;
        this.mode$.emit('display');
        this.resetMessages();
        this.resetData();
    }

    // todo: check what this is for and if it is really needed
    public clone() {
        let clone: any = {
            module: this.module,
            id: this.id,
            data: {...this.data},
        };
        return clone;
    }

    public getAuditLog(filters: any = {}): Observable<any> {
        let responseSubject = new Subject<boolean>();

        this.backend.getRequest(`module/${this.module}/${this.id}/auditlog`, filters, this.httpRequestsRefID).subscribe({
            next: (res) => {
                responseSubject.next(res);
                responseSubject.complete();
            },
            error: (error) => {
                responseSubject.next(error);
                responseSubject.complete();
            }
        });
        return responseSubject.asObservable();
    }

    public resetData() {
        this.isValid = true;
        this.data = {};
    }

    /**
     * initializes the whole model, overwrites its data and executes copy, validation rules...
     * @param parent    if given, it initilizes its data using the parent
     * @returns {any}
     */
    public initialize(parent: any = null) {
        return this.initializeModel(parent);
    }

    public initializeModel(parent: model = null) {
        if (!this.id) {
            this.id = this.generateGuid();
            this.isNew = true;
        }

        // reset the duplicates
        this.duplicates = [];

        // reset the data object
        this.data = {};
        // this.data.id = this.id;

        // get the fields and check assigned fields
        let moduleFields = this.metadata.getModuleFields(this.module);
        if (moduleFields.assigned_user_id) {
            this.data.assigned_user_id = this.session.authData.userId;
            this.data.assigned_user_name = this.session.authData.userName;
            this.data.assigned_user = this.session.authData.user;
        }

        if (moduleFields.assigned_orgunit_id && this.session.authData.user.orgunit) {
            this.data.assigned_orgunit_id = this.session.authData.user.orgunit.id;
            this.data.assigned_orgunit_name = this.session.authData.user.orgunit.name;
            this.data.assigned_orgunit = this.session.authData.user.orgunit;
        }

        this.data.modified_by_id = this.session.authData.userId;
        this.data.modified_by_name = this.session.authData.userName;
        this.data.modified_by_user = this.session.authData.user;

        this.data.created_by_id = this.session.authData.userId;
        this.data.created_by_name = this.session.authData.userName;
        this.data.created_by_user = this.session.authData.user;

        this.data.date_entered = new moment();
        this.data.date_modified = new moment();

        this.executeCopyRules(parent);
        this.setFieldsDefaultValues();
        this.evaluateValidationRules(null,'initialize');

        // set default acl to allow editing
        this.acl = {
            create: true,
            edit: true,
            detail: true
        };

        // get the field control
        this.acl_fieldcontrol = this.metadata.moduleDefs[this.module]?.acl_fieldcontrol ?? [];

        // initialize the field stati and run the initial evaluation rules
        this.initializeFieldsStati();
        this.evaluateValidationRules(null, 'initialize');

        // set the parent model from the intialized one in the call
        this.parentmodel = parent;
    }

    /**
     * sets the model data from teh backend
     * also extracts the acl data from teh backend response
     *
     * @param data
     * @param transform .. set to false to not transform the data
     * @param silent .. st to true to not emit data after setting the data on teh model
     */
    public setData(data: any, transform = true, silent?: boolean) {
        if (data.acl) {
            this.acl = data.acl;
        }
        if (data.acl_fieldcontrol) {
            this.acl_fieldcontrol = data.acl_fieldcontrol;
            delete data.acl_fieldcontrol;
        }
        this.data = transform ? this.utils.backendModel2spice(this.module, data) : data;

        // emit the data changes
        if (silent !== true) {
            this.data$.next(this.data);
        }

        // initialize the field stati
        this.initializeFieldsStati();
    }

    /**
     * adds a model
     *
     * @param addReference, a reference that is returned .. can be sooner than later be discontinued
     * @param parent the parent model used for copyrules applications
     * @param presets kind of preset fields
     * @param preventGoingToRecord
     * @param componentconfig
     */
    public addModel(addReference: string = "", parent: any = null, presets: any = {}, preventGoingToRecord = false, componentconfig?) {

        // a response subject to return if the model has been saved
        let retSubject = new Subject<any>();

        // acl check if we are alowed to create
        if (this.metadata.checkModuleAcl(this.module, "create")) {
            this.initializeModel(parent);

            // set teh reference
            this.reference = addReference;

            // copy presets
            for (let fieldname in presets) {
                this.data[fieldname] = presets[fieldname];
            }

            // run the evaluation rules
            this.evaluateValidationRules(null, 'initialize');

            this.modal.openModal("ObjectEditModal", false, this.injector).subscribe(editModalRef => {
                if (editModalRef) {
                    editModalRef.instance.model.isNew = true;
                    editModalRef.instance.reference = this.reference;
                    editModalRef.instance.preventGoingToRecord = preventGoingToRecord;

                    // if we have passed in a componentconfig use this one
                    if (componentconfig) {
                        editModalRef.instance.componentconfig = componentconfig;
                    }

                    // subscribe to the action$ observable and execute the subject
                    editModalRef.instance.action$.subscribe(response => {

                        // if we save .. add to the last viewed
                        if (response == 'save' || response == 'savegodetail') {
                            retSubject.next(this.data);
                            this.recent.trackItem(this.module, this.id, this.data);
                        }

                        // complete the subject
                        retSubject.complete();
                    });
                }
            });
        } else {
            this.toast.sendToast(this.language.getLabel("MSG_NOT_AUTHORIZED_TO_CREATE") + " " + this.language.getModuleName(this.module), "error");
            window.setTimeout(() => {
                retSubject.complete();
            }, 100);
        }
        return retSubject.asObservable();
    }

    /**
     * executes the copy rules on the bean. FIrst generic then of the optional parent
     *
     * @param parent a model or an array of models
     */
    public executeCopyRules(parent?: any) {

        this.copyParentReferenceAddresses(parent);

        this.executeCopyRulesGeneric();

        if (parent) {
            if (_.isArray(parent)) {
                for (let thisParent of parent) {
                    if (thisParent.data) this.executeCopyRulesParent(thisParent);
                }
            } else {
                if (parent.data) this.executeCopyRulesParent(parent);
            }
        }

    }

    /**
     * copy referenced addresses from parent
     * @param parent
     * @private
     */
    private copyParentReferenceAddresses(parent?: model) {

        if (!parent) return;

        const referenceMetadata = this.configuration.getData('spice_address_references');

        if (!Array.isArray(referenceMetadata)) return;

        (referenceMetadata as AddressRefMetadataI[]).forEach(m => {

            if (m.child_module != this.module || parent.module != m.parent_module) return;

            this.copyReferencedAddress(m, parent.data);
        });
    }

    /**
     * fill in the address fields from the parent reference bean address
     * @param metadata
     * @param data
     */
    public copyReferencedAddress(metadata: AddressRefMetadataI, data) {

        const fields = {};
        [
            'address_street',
            'address_street_number',
            'address_street_number_suffix',
            'address_attn',
            'address_city',
            'address_district',
            'address_postalcode',
            'address_state',
            'address_country',
            'address_latitude',
            'address_longitude'
        ].forEach(f =>
            fields[`${metadata.child_address_key}_${f}`] = data[`${metadata.parent_address_key}_${f}`]
        );

        fields[metadata.child_address_key + '_address_reference_id'] = data.id;

        this.setFields(fields);
    }


    /**
     * set fields default values from the fields definitions
     * @private
     */
    public setFieldsDefaultValues() {
        const moduleFields = this.metadata.getModuleFields(this.module);
        if (!moduleFields) return;
        _.each(moduleFields, fieldDefs => {
            if (!('default' in fieldDefs) || this.data[fieldDefs.name] != undefined || fieldDefs.type == 'link' || fieldDefs.source == 'non-db') return;
            this.setFixedValue(fieldDefs.name, fieldDefs.default);
        });
    }

    // get generic copy rules
    public executeCopyRulesGeneric() {
        let copyrules = this.metadata.getCopyRules("*", this.module);
        for (let copyrule of copyrules) {
            if (copyrule.tofield && copyrule.fixedvalue) {
                this.setFixedValue(copyrule.tofield, copyrule.fixedvalue);
            } else if (copyrule.tofield && copyrule.calculatedvalue) {
                this.setField(copyrule.tofield, this.getCalculatedValue(copyrule));
            }
        }
    }

    // apply parent specific copy rules
    public executeCopyRulesParent(parent) {
        // todo: figure out why we loose the id in data
        if (!parent.data.id) parent.data.id = parent.id;
        let copyRules = this.metadata.getCopyRules(parent.module, this.module);
        for (let copyRule of copyRules) {
            if (!copyRule.tofield) continue;
            if (!!copyRule.fromfield) {
                this.copyValue(copyRule.tofield, parent.data[copyRule.fromfield], copyRule.params);
            } else if (!!copyRule.fixedvalue) {
                this.setFixedValue(copyRule.tofield, copyRule.fixedvalue);
            }
            if (!!copyRule.calculatedvalue) {
                this.setField(copyRule.tofield, this.getCalculatedValue(copyRule, parent.data[copyRule.fromfield]));
            }
        }
    }

    /**
     * copy the value to a field. Executed from the copy rules. Handles links special with deep copy
     *
     * @param toField
     * @param value
     * @param params
     * @private
     */
    public copyValue(toField, value, params: any = {}) {
        let fieldDef = this.metadata.getFieldDefs(this.module, toField);
        // if not found just set the field attribute
        if (!fieldDef) {
            this.setField(toField, value);
            return;
        }

        // handle links
        switch (fieldDef.type) {
            case 'json':
                this.setField(toField, JSON.parse(JSON.stringify(value)));
                break;
            case 'link':
                if (_.isObject(value) && value.beans) {
                    const newLink = {beans: {}};
                    for (let relId in value.beans) {
                        if (!value.beans.hasOwnProperty(relId)) continue;
                        let newId = relId;
                        if (params?.generatenewid) {
                            newId = this.utils.generateGuid();
                        }
                        newLink.beans[newId] = {...value.beans[relId]};
                        newLink.beans[newId].id = newId;
                        this.setField(toField, newLink);
                    }
                }
                break;
            default:
                this.setField(toField, value);
                break;
        }
    }

    /**
     * Set the fixed value to a field. Executed from the copy rules. Takes the field type into account.
     *
     * @param toField
     * @param value
     */
    public setFixedValue(toField, value) {
        let fieldDef = this.metadata.getFieldDefs(this.module, toField);

        // if no field definition found just set the field attribute
        if (!fieldDef || (fieldDef && !fieldDef.type)) this.setField(toField, value);

        if (fieldDef && fieldDef.type) {
            switch (fieldDef.type) {
                case 'bool':
                    this.setField(toField, (value === 'true' || value === '1') ? true : ((value === 'false' || value === '0') ? false : null));
                    break;
                default:
                    // set nullable in validation rules
                    if(value == '(NULL)') value = null;

                    this.setField(toField, value);
                    break;
            }
        }
    }

    /**
     * the the copy rule calculated value
     * @param copyRule
     * @param fromField
     */
    public getCalculatedValue(copyRule: { fromfield: string, tofield: string, fixedvalue: string, calculatedvalue: string, params: any }, fromField?: string) {

        let timeZone = this.session.getSessionData('timezone', false) || moment.tz.guess(true);
        switch (copyRule.calculatedvalue) {
            case "now":
                return new moment.utc().tz(timeZone);
            case "nextfullhour":
                let date = new moment.utc().tz(timeZone);
                if (date.minute() != 0) {
                    date.minute(0);
                    date.add(1, "h");
                }

                // see if we should add some units
                if (copyRule.params?.number && copyRule.params?.unit) {
                    date.add(copyRule.params.number, copyRule.params.unit);
                }

                return date;

            case "addDate":
                const fromFieldDate = moment.isMoment(fromField) ? new moment(fromField) : new moment.utc().tz(timeZone);

                if (!copyRule.params?.number || !copyRule.params?.unit) return fromFieldDate;

                return fromFieldDate.add(copyRule.params.number, copyRule.params.unit);

            case "nl2br":
                return fromField.replace(/\r\n/g, '<br>').replace(/\n\n/g, '<br>').replace(/\n/g, '<br>');
        }
        return "";
    }

    /*
    * open an edit modal using the injecor from the provider
     */
    public edit(reload: boolean = false, componentSet: string = ""): Observable<any> {
        // check if the user can edit
        if (!this.checkAccess("edit")) {
            return of(false);
        }

        // create a response subject
        let responseSubject = new Subject<any>();

        // open the edit Modal
        this.modal.openModal("ObjectEditModal", false, this.injector).subscribe(editModalRef => {
            if (editModalRef) {

                // check if a requested componentset for the modal was passed in
                if (componentSet && componentSet != "") {
                    editModalRef.instance.componentSet = componentSet;
                }

                // check if the model shoudl be reloaded
                if (reload) {
                    editModalRef.instance.model.getData(false, "editview", false);
                }

                // emit the action triggered
                editModalRef.instance.actionSubject.subscribe(response => {
                    responseSubject.next(response);
                    responseSubject.complete();
                });
            }
        });

        // return the subject as observable
        return responseSubject.asObservable();
    }


    /**
     * checks the given fields that have been changed internally if theey are relevant for the duplicate check
     *
     *  @param changedFields an array with fieldnames that has been changed in order to allow the method to determine the scope fo the change and if a duplicate check shoudl be performed
     */
    public duplicateCheckOnChange(changedFields: string[], forcecheck: boolean = false): Observable<boolean> {
        if (this.isNew && this.metadata.getModuleDuplicatecheckOnChange(this.module)) {
            let dupCheckFields = this.metadata.getModuleDuplicateCheckFields(this.module);

            // return if we do not have any fields to check for
            if (dupCheckFields.length == 0) return;

            // cancheeck determines if we have at least one of the duplicate valkues set, otherwise a duplicate check makes no sense
            let cancheck = false;
            // shoudlcheck determines if any of the duplicate check fields has been changed and a check shopudl be performed
            let shouldcheck = false;
            // determine the flags
            for (let dupCheckField of dupCheckFields) {
                if (!shouldcheck) shouldcheck = changedFields.indexOf(dupCheckField) >= 0;
                if (!cancheck) cancheck = this.getField(dupCheckField);
            }

            // execute the check or empty the duplicates array on the bean
            if ((cancheck && shouldcheck) || forcecheck) {
                let retSubject = new Subject<any>();
                // do the check
                this.duplicateCheck(true).subscribe({
                    next: (duplciates) => {
                        this.duplicates = duplciates.records;
                        this.duplicatecount = duplciates.count;

                        retSubject.next(true);
                        retSubject.complete();
                    },
                    error: () => {
                        retSubject.next(false);
                        retSubject.complete();
                    }
                });
                return retSubject.asObservable();
            } else if (shouldcheck && !cancheck) {
                this.duplicates = [];
            }
        }
        return of(false);
    }

    /**
     * executes a duplicate check on the backend
     *
     * @param fromModelData indicates if the check is to be done from teh current actual modeldata. If set to true the curretn data will be used. Otherwise the data stored in the backend will be used and the data will be reloaded during the request on the backend
     */
    public duplicateCheck(fromModelData: boolean = false) {

        // check if this is a new model and the model support the duplicate check
        if (this.metadata.getModuleDuplicatecheck(this.module)) {
            this.duplicateChecking = true;
            let responseSubject = new Subject<any>();
            if (fromModelData) {
                let _modeldata = this.data;
                _modeldata.id = this.id;
                this.backend.checkDuplicates(this.module, _modeldata, this.httpRequestsRefID).subscribe({
                    next: (res) => {
                        responseSubject.next(res);
                        responseSubject.complete();
                        this.duplicateChecking = false;
                    },
                    error: () => {
                        responseSubject.next([]);
                        responseSubject.complete();
                        this.duplicateChecking = false;
                    }
                });
            } else {
                this.backend.getDuplicates(this.module, this.id, this.httpRequestsRefID).subscribe({
                    next: (res) => {
                        responseSubject.next(res);
                        responseSubject.complete();
                        this.duplicateChecking = false;

                    },
                    error: () => {
                        responseSubject.next([]);
                        responseSubject.complete();
                        this.duplicateChecking = false;
                    }
                });
            }
            return responseSubject.asObservable();
        }

        return of([]);
    }

    /**
     * adds a message to the global model if ref is null else to the field itself
     *
     * @param {string} type can be of value error | warning | notice
     * @param {string} message
     * @param {string} ref  can be any fieldname
     * @param {string} source can be any identifying string, by default it is "validation", so it can be erased only be validation
     * @returns {boolean}
     */
    public addMessage(type: "error" | "warning" | "notice", message: string, ref: string = null, source = "validation"): boolean {
        this._messages.push({
            type,
            message,
            reference: ref,
            source,
        });
        if (type == "error" && ref) {
            this.setFieldStatus(ref, "invalid", true);
        }
        this.messageChange$.emit(true);
        return true;
    }

    /**
     * returns the messages collected during the validation process
     */
    public getMessages() {
        return this.messages;
    }

    public setFieldMessage(type: "error" | "warning" | "notice", message: string, ref: string, source: string): boolean {
        this.resetFieldMessages(ref, type, source);
        if (type == "error") {
            this.setFieldStatus(ref, "invalid", true);
        }
        return this.addMessage(type, message, ref, source);
    }

    /**
     * returns all messages for the given field/reference and if given, the type of your choice
     *
     * @param {string} ref    can be any fieldname
     * @param {string} type     can be of value error | warning | notice
     * @returns {any[]}
     */
    public getFieldMessages(ref: string, type ?: "error" | "warning" | "notice") {
        let messages = this._messages.filter((e) => {
            return e.reference == ref && (!type || e.type == type);
        });
        if (messages.length > 0) {
            return messages;
        } else {
            return false;
        }
    }

    public resetFieldMessages(ref: string, type ?: "error" | "warning" | "notice", source ?: string): boolean {
        if (this._messages.length == 0) {
            return true;
        }

        for (let i = this._messages.length - 1; i >= 0; i--) {
            let e = this._messages[i];
            if (e.reference == ref && (!type || e.type == type) && (!source || e.source == source)) {
                this._messages.splice(i, 1);
                this.messageChange$.emit(true);
            }
        }

        // reset stati caused by messages...
        this.resetFieldStati(ref);
        return true;
    }

    public

    resetMessages(type ?: string, source: string = "validation"): boolean {
        if (this._messages.length == 0) {
            return true;
        }

        for (let i = this._messages.length - 1; i >= 0; i--) {
            let e = this._messages[i];
            if ((!type || e.type == type) && (!source || e.source == source)) {
                this._messages.splice(i, 1);
                this.messageChange$.emit(true);
            }
            // reset stati caused by messages...
            this.resetFieldStati(e.reference);
        }
        return true;
    }


    public isFieldARelationLink(field_name) {
        try {
            return (this.fields[field_name].type == "link");
        } catch (e) {
            return false;
        }
    }

    /**
     * returns an array of records instead of the object stored in the data...
     *
     * @param relation_link_name {string} the name of the link used to retrieve the related records
     * @returns {any[]} an array of records
     */
    public getRelatedRecords(relation_link_name: string): any[] {
        let records = [];

        if (!this.isFieldARelationLink(relation_link_name)) {
            // throw new Error(relation_link_name + " is not of type \"link\"!");
            return records;
        }


        if (!this.data[relation_link_name]) {
            return records;
        }

        for (let id in this.data[relation_link_name].beans) {
            records.push(this.data[relation_link_name].beans[id]);
        }

        return records;
    }

    /**
     * sets an array of records to the given link name
     * @param {string} relation_link_name
     * @param {any[]} records
     * @returns {boolean}
     */
    public setRelatedRecords(relation_link_name: string, records: any[] = null): boolean {
        if (!this.isFieldARelationLink(relation_link_name)) {
            return false;
        }

        this.data[relation_link_name] = {beans: {}};
        if (records) {
            return this.addRelatedRecords(relation_link_name, records);
        }
        this.field$.next({field: relation_link_name, value: this.getRelatedRecords(relation_link_name)});

    }

    /**
     * adds an array of records to the given link name
     * @param {string} relation_link_name
     * @param {any[]} records
     * @param {boolean} overwrite default true, if false, it will ignore records which are already set
     * @returns {boolean}
     */
    public addRelatedRecords(relation_link_name:string, records: any[], overwrite = true): boolean {
        if (!this.isFieldARelationLink(relation_link_name)) {
            return false;
        }

        if (!this.data[relation_link_name]) {
            this.data[relation_link_name] = {beans: {}};
        }

        for (let record of records) {
            if (!overwrite && this.data[relation_link_name].beans[record.id]) {
                continue;
            }
            this.data[relation_link_name].beans[record.id] = record;
        }

        this.field$.next({field: relation_link_name, value: this.getRelatedRecords(relation_link_name)});

        return true;
    }

    /**
     * remove an array of records from the given link name
     * add the item to the 'beans_relations_to_delete'-array
     * @param {string} relation_link_name
     * @param {any[]} records
     * @returns {boolean}
     */
    public removeRelatedRecords(relation_link_name: string, records: any[]): boolean {
        if (!this.isFieldARelationLink(relation_link_name)) {
            return false;
        }

        if (!this.data[relation_link_name]) {
            this.data[relation_link_name] = {beans: []};
        }

        if (!this.data[relation_link_name].beans_relations_to_delete) {
            this.data[relation_link_name].beans_relations_to_delete = {};
        }

        for (let record of records) {

            for (let id in this.data[relation_link_name].beans) {
                if (record == id) {
                    delete this.data[relation_link_name].beans[id];
                    this.data[relation_link_name].beans_relations_to_delete[id] = record;
                }
            }
        }

        return true;
    }

    /**
     * rollback removed related records
     */
    public rollbackRemovedRelatedRecords(relation_link_name: string, records: any[]): boolean {
        if (!this.isFieldARelationLink(relation_link_name) || !this.data[relation_link_name].beans_relations_to_delete) {
            return false;
        }

        records.forEach(id => {
            delete this.data[relation_link_name].beans_relations_to_delete[id];
        });

        return true;
    }


    public ngOnDestroy(): void {

        if (this.isEditing) {
            this.navigation.removeModelEditing(this.module, this.id);
        }

        if (this.modelRegisterId) {
            this.navigation.unregisterModel(this.modelRegisterId);
        }

        // unsubscribe from any subscriptions we might have
        this.subscriptions.unsubscribe();

        this.backend.cancelPendingRequests([this.httpRequestsRefID]);
    }

    public isDirty(): boolean {
        return (this.isEditing && _.values(this.getDirtyFields()).length);
    }

    /**
     * Check Module Filter Match
     * @param {string} moduleFilterId
     * @returns {boolean}
     */
    public checkModuleFilterMatch(moduleFilterId): boolean {
        let moduleFilters = this.configuration.getData('modulefilters');
        if (!moduleFilters[moduleFilterId] || !moduleFilters[moduleFilterId].filterdefs) return false;
        let filterDefs = moduleFilters[moduleFilterId].filterdefs;
        filterDefs = typeof filterDefs == 'string' ? JSON.parse(filterDefs) : filterDefs;
        return moduleFilters ? this.checkModuleFilterGroupMatch(filterDefs) : false;
    }

    /**
     * Check Module Filter Group Match
     * @param group
     * @returns {boolean}
     */
    public checkModuleFilterGroupMatch(group) {
        if (group.groupscope == 'own' && this.data.assigned_user_id != this.session.authData.userId) return false;

        let conditionMet = false;
        if (!group || !group.conditions) return false;
        group.conditions.forEach(condition => {
            if (condition.conditions) {
                conditionMet = this.checkModuleFilterGroupMatch(condition);
            } else {
                conditionMet = this.checkModuleFilterConditionMatch(condition);
            }

            if (group.logicaloperator == 'AND' && !conditionMet) {
                return false;
            } else if (conditionMet) {
                return true;
            }
        });

        return conditionMet;
    }

    /**
     * Check Module Filter Condition Match
     * @param condition
     * @returns {boolean}
     */
    public checkModuleFilterConditionMatch(condition) {
        switch (condition.operator) {
            case 'empty':
                return this.getFieldValue(condition.field) == '' || this.getFieldValue(condition.field) == null;
            case 'equals':
                return this.getFieldValue(condition.field) == condition.filtervalue;
            case 'oneof':
                let valArray = condition.filtervalue instanceof Array ? condition.filtervalue : condition.filtervalue.split(',');
                return valArray.indexOf(this.getFieldValue(condition.field)) > -1;
            case 'true':
                return this.getFieldValue(condition.field) == 1;
            case 'false':
                return this.getFieldValue(condition.field) == 0;
            case 'starts':
                return this.getFieldValue(condition.field).indexOf(condition.filtervalue) == 0;
            case 'contains':
                return this.getFieldValue(condition.field).includes(condition.filtervalue);
            case 'ncontains':
                return !this.getFieldValue(condition.field).includes(condition.filtervalue);
            case 'greater':
                return this.getFieldValue(condition.field) > condition.filtervalue;
            case 'gequal':
                return this.getFieldValue(condition.field) >= condition.filtervalue;
            case 'less':
                return this.getFieldValue(condition.field) < condition.filtervalue;
            case 'lequal':
                return this.getFieldValue(condition.field) <= condition.filtervalue;
            case 'today':
                return moment(this.getFieldValue(condition.field)).isSame(new moment(), 'days');
            case 'past':
                return moment(this.getFieldValue(condition.field)).isBefore(new moment());
            case 'future':
                return moment(this.getFieldValue(condition.field)).isAfter(new moment());
            case 'thismonth':
                return moment(this.getFieldValue(condition.field)).isSame(new moment(), 'month');
            case 'nextmonth':
                return moment(this.getFieldValue(condition.field)).isAfter(new moment(), 'month');
            case 'thisyear':
                return moment(this.getFieldValue(condition.field)).isSame(new moment(), 'year');
            case 'nextyear':
                return moment(this.getFieldValue(condition.field)).isAfter(new moment(), 'year');
            case 'inndays':
                return moment(this.getFieldValue(condition.field)).isSame(new moment().add(+condition.filtervalue, 'd'), 'days');
            case 'ndaysago':
                return moment(this.getFieldValue(condition.field)).isSame(new moment().subtract(+condition.filtervalue, 'd'), 'days');
            case 'inlessthandays':
                return moment(this.getFieldValue(condition.field)).isBefore(new moment().add(+condition.filtervalue, 'd'), 'days');
            case 'inmorethandays':
                return moment(this.getFieldValue(condition.field)).isAfter(new moment().add(+condition.filtervalue, 'd'), 'days');
        }
    }

    /**
     * Deep cloning of an object. Minds also moment objects.
     * @param object The object to clone.
     */
    public buildBackup(object) {
        let clone = {};
        _.each(object, (value, key) => {
            if (_.isObject(value)) {
                if (_.isArray(value)) {
                    clone[key] = value.map(item => this.buildBackup(item));
                } else if (moment.isMoment(value)) {
                    clone[key] = moment(value);
                } else {
                    clone[key] = this.buildBackup(value);
                }
            } else {
                clone[key] = object[key];
            }
        });
        return clone;
    }

    /**
     * generate html content blob
     */
    public generateFieldHtmlContentBlobUrl(fieldName: string) {

        return this.backend.getRequest(`module/${this.module}/${this.id}/${fieldName}/html`).pipe(
            map(content => {
                const blob = new Blob([content.html], {type: 'text/html'});
                return this.sanitizer.bypassSecurityTrustResourceUrl(
                    window.URL.createObjectURL(blob)
                );
            })
        );
    }

}
