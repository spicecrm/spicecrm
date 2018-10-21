import {Injectable, EventEmitter, ViewContainerRef, Injector} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject} from "rxjs";
import {CanActivate} from "@angular/router";
import {Observable} from "rxjs";

import {session} from "./session.service";
import {modal} from "./modal.service";
import {language} from "./language.service";
import {modelutilities} from "./modelutilities.service";
import {toast} from "./toast.service";
import {broadcast} from "./broadcast.service";
import {metadata} from "./metadata.service";
import {backend} from "./backend.service";
import {recent} from "./recent.service";
import {Router} from "@angular/router";
import {ObjectOptimisticLockingModal} from "../objectcomponents/components/objectoptimisticlockingmodal";

declare var moment: any;
moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";
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

@Injectable()
export class model {
    private _module: string = "";
    public id: string = "";
    public acl: any = {};
    public data: any = {
        acl: {
            edit: true
        }
    };
    private backupData: any = {};
    public data$ = new EventEmitter();
    public isValid: boolean = false;
    public isLoading: boolean = false;
    public isEditing: boolean = false;
    public isNew: boolean = false;
    private _fields_stati: any = []; // will be build by initialization of the model
    private _fields_stati_tmp: any = []; // will be erased when evaluateValidationRules() is called
    private _model_stati_tmp: any = [];  // will be erased when evaluateValidationRules() is called
    private _messages: any = [];
    private reference: string = "";
    private _fields: any = [];
    public messageChange$ = new EventEmitter<boolean>();

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private metadata: metadata,
        public utils: modelutilities,
        private session: session,
        private recent: recent,
        private router: Router,
        private toast: toast,
        private language: language,
        private modal: modal,
        private injector: Injector
    ) {

    }

    get messages(): any[] {
        return this._messages;
    }

    get module(): string {
        return this._module;
    }

    set module(val: string) {
        this._module = val;
        this.initializeFieldsStati();
    }

    get fields(): any[] {
        if (this.module && (!this._fields || this._fields.length == 0)) {
            this._fields = this.metadata.getModuleFields(this.module);
        }

        return this._fields;
    }

    public generateGuid(): string {
        return this.utils.generateGuid();
    }

    /*
     * meta data related functions
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

    public isRequired(field: string) {
        return this.isFieldRequired(field);
    }

    /**
     * access checkl
     */
    public checkAccess(access) {
        if (this.data && this.data.acl) {
            return this.data.acl[access];
        } else {
            return false;
        }
    }

    /**
     * navigation function
     */
    public goDetail() {
        if (this.checkAccess("detail")) {
            this.router.navigate(["/module/" + this.module + "/" + this.id]);
        } else {
            return false;
        }
    }

    public goToDetail() {
        this.goDetail();
    }

    public goModule() {
        this.router.navigate(["/module/" + this.module]);
    }

    public goToModule() {
        this.goModule();
    }

    public goToListView() {
        this.goModule();
    }

    /**
     * Model functions
     */
    public getData(resetData: boolean = true, trackAction: string = "", setLoading: boolean = true, redirectNotFound = false): Observable<any> {
        let responseSubject = new Subject<any>();

        if (resetData) {
            this.resetData();
        }

        // set laoding
        this.isLoading = setLoading;

        this.backend.get(this.module, this.id, trackAction).subscribe(
            res => {
                this.data = res;
                this.data$.emit(res);
                this.broadcast.broadcastMessage("model.loaded", {id: this.id, module: this.module, data: this.data});
                responseSubject.next(res);
                responseSubject.complete();

                if (trackAction != "") {
                    this.recent.trackItem(this.module, this.id, this.data.summary_text);
                }
                this.initializeFieldsStati();
                this.evaluateValidationRules(null, "init");
                this.isLoading = false;
            },
            err => {
                if (redirectNotFound) {
                    this.toast.sendToast("Error loading Record", "error");
                    this.router.navigate(["/module/" + this.module]);
                }
            }
        );
        return responseSubject.asObservable();
    }

    public validate(event?: string) {
        this.resetMessages();
        this.isValid = true;
        for (let field in this.fields) {
            // check required
            if (
                field !== "id" && this.getFieldStati(field).required &&
                (!this.data[field] || this.data[field].length === 0)
            ) {
                this.isValid = false;
                this.addMessage("error", this.language.getLabel("MSG_INPUT_REQUIRED") + "!", field);
            }
            if (this.getFieldStati(field).invalid) {
                this.isValid = false;
            }
        }
        if (!this.isValid) {
            console.warn("validation failed:", this.messages);
        }
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
    private evaluateFieldStati(field: string) {
        let stati = this.getDefaultStati();

        // editable... acl check?!
        if (
            this.data &&
            this.data.acl_fieldcontrol &&
            this.data.acl_fieldcontrol[field] &&
            parseInt(this.data.acl_fieldcontrol[field], 10) < 3
        ) {
            stati.editable = false;
        }

        if (this.isRequired(field)) {
            stati.required = true;
        }

        return stati;
    }

    private resetFieldStati(field: string) {
        this._fields_stati[field] = this.evaluateFieldStati(field);
        // tmp stati
        this._fields_stati_tmp[field] = {... this._fields_stati[field]};
        if (this.getFieldMessages(field, "error")) {
            this._fields_stati_tmp[field].invalid = true;
        }
    }

    public setFieldStatus(field: string, status: string, value: boolean = true): boolean {
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
            let checksum: number = 0;
            let is_valid: boolean = true;

            if (validation.onevents instanceof Array && !validation.onevents.includes(event)) {
                continue;
            }

            if (validation.conditions instanceof Array) {
                // check conditions...
                for (let condition of validation.conditions) {
                    let result = false;
                    if (condition.onchange == 1 && field && condition.fieldname != field) {
                        result = false;
                    } else {
                        result = this.evaluateCondition(condition);
                    }
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

        if (typeof this.data[condition.fieldname] == "undefined") {
            return false;
        }

        let val_left = this.data[condition.fieldname];
        let val_right = this.evaluateValidationParams(condition.valuations);

        check = modelutilities.compare(val_left, condition.comparator, val_right);

        console.log("checking: " + condition.fieldname + " " + condition.comparator + " " + condition.valuations,
            val_left + " " + condition.comparator + " " + val_right + " is " + check);

        return check;
    }

    public executeValidationAction(action): boolean {
        console.log("doing: " + action.action + " with " + action.params + " on " + action.fieldname);
        let params = this.evaluateValidationParams(action.params);
        switch (action.action) {
            case "set_value":
                this.data[action.fieldname] = params;
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
                    editable: true,
                    invalid: false,
                    required: false,
                    incomplete: false,
                    disabled: false,
                    hidden: false,
                    readonly: false,
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

    public evaluateValidationParams(params, targettype?: string) {
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
                            if (replace)
                                replace = replace.format("YYYY-MM-DD HH:mm:ss");
                            break;
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

    public startEdit() {
        // shift to backend format .. no objects like date embedded
        this.backupData = {...this.data};
        this.isEditing = true;
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

    public setFieldValue(field, value) {
        if (!field) return false;
        if (_.isString(value)) value = value.trim();
        this.data[field] = value;
        this.data$.emit(this.data);
        this.evaluateValidationRules(field, "change");
    }

    public setField(field, value) {
        return this.setFieldValue(field, value);
    }

    public cancelEdit() {
        this.isEditing = false;
        if (this.backupData) {
            this.data = {...this.backupData};
            this.data$.emit(this.data);
            this.backupData = null;
            // todo: evaluate all fields because they have changed back???
            this.resetMessages();
        }
    }

    public endEdit() {
        this.backupData = null;
        this.isEditing = false;
    }

    private getDirtyFields() {
        let d = {};
        for (let property in this.data) {
            if (property && (_.isArray(this.data[property]) || !_.isEqual(this.data[property], this.backupData[property]) || this.isFieldARelationLink(property))) {
                d[property] = this.data[property];
            }
        }
        return d;
    }

    public save(notify: boolean = false): Observable<boolean> {
        let responseSubject = new Subject<boolean>();

        // determine changed fields
        let changedData: any = {};
        if (this.isEditing) {
            changedData = this.getDirtyFields();
            // in any case send back date_modified
            changedData.date_modified = this.data.date_modified;

            // hack to provoke the changes for Testing
            // changedData.date_modified.subtract( 1, 'days');
        } else {
            changedData = this.data;
        }

        this.backend.save(this.module, this.id, changedData)
            .subscribe(
                res => {
                    this.data = res;
                    this.isNew = false;
                    this.data$.emit(res);
                    this.broadcast.broadcastMessage("model.save", {
                        id: this.id,
                        reference: this.reference,
                        module: this.module,
                        data: this.data
                    });
                    responseSubject.next(true);
                    responseSubject.complete();

                    if (notify) {
                        this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    }

                    this.endEdit();
                },
                error => {
                    console.log(error);
                    switch (error.status) {
                        case 409:
                            this.modal.openModal("ObjectOptimisticLockingModal", true, this.injector).subscribe(lockingModalRef => {
                                lockingModalRef.instance.conflicts = error.error.error.conflicts;
                            });
                            break;
                        default:
                            if (notify) {
                                this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.message);
                            }
                            ;
                            break;
                    }
                });
        return responseSubject.asObservable();
    }

    public delete(): Observable<boolean> {
        let responseSubject = new Subject<boolean>();
        this.backend.delete(this.module, this.id)
            .subscribe(res => {
                this.broadcast.broadcastMessage("model.delete", {id: this.id, module: this.module});
                responseSubject.next(true);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    /**
     * resets all model"s data to a blank state
     */
    public reset() {
        this.id = null;
        this.module = null;
        this._fields_stati_tmp = this._fields_stati = [];

        this.isLoading = false;
        this.isEditing = false;
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
        this.backend.getAudit(this.module, this.id, filters)
            .subscribe(
                res => {
                    responseSubject.next(res);
                    responseSubject.complete();
                },
                error => {
                    responseSubject.next(error);
                    responseSubject.complete();
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

    public initializeModel(parent: any = null) {
        if (!this.id) {
            this.id = this.generateGuid();
        }

        this.data = {};
        this.data.assigned_user_id = this.session.authData.userId;
        this.data.assigned_user_name = this.session.authData.userName;
        this.data.modified_by_id = this.session.authData.userId;
        this.data.modified_by_name = this.session.authData.userName;
        this.data.date_entered = new moment();
        this.data.date_modified = new moment();

        this.executeCopyRules(parent);
        this.evaluateValidationRules();

        // set default acl to allow editing
        this.data.acl = {
            edit: true
        }

        // initialize the field stati and run the initial evaluation rules
        this.initializeFieldsStati();
        this.evaluateValidationRules(null, "init");
    }

    public addModel(addReference: string = "", parent: any = null, presets: any = {}) {

        // a response subject to return if the model has been saved
        let retSubject = new Subject<any>();

        // acl check if we are alowed to create
        if (this.metadata.checkModuleAcl(this.module, "create")) {
            this.initializeModel();
            this.executeCopyRules(parent);

            // set teh reference
            this.reference = addReference;

            // copy presets
            for (let fieldname in presets) {
                this.data[fieldname] = presets[fieldname];
            }

            this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
                if (editModalRef) {
                    editModalRef.instance.model.isNew = true;
                    editModalRef.instance.reference = this.reference;

                    // subscribe to the action$ observable and execute the subject
                    editModalRef.instance.action$.subscribe(response => {
                        retSubject.next(response);
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

    private executeCopyRules(parent) {
        // get generic copy rules
        let copyrules = this.metadata.getCopyRules("*", this.module);
        for (let copyrule of copyrules) {
            if (copyrule.tofield && copyrule.fixedvalue) {
                this.setFieldValue(copyrule.tofield, copyrule.fixedvalue);
            } else if (copyrule.tofield && copyrule.calculatedvalue) {
                this.setFieldValue(copyrule.tofield, this.getCalculatdValue(copyrule.calculatedvalue));
            }
        }

        // apply parent specific copy rules
        if (parent && parent.data) {

            // todo: figure out why we loose the id in data
            if (!parent.data.id) {
                parent.data.id = parent.id;
            }
            copyrules = this.metadata.getCopyRules(parent.module, this.module);
            for (let copyrule of copyrules) {
                if (copyrule.fromfield && copyrule.tofield) {
                    this.setFieldValue(copyrule.tofield, parent.getFieldValue(copyrule.fromfield));
                } else if (copyrule.tofield && copyrule.fixedvalue) {
                    this.setFieldValue(copyrule.tofield, copyrule.fixedvalue);
                }
            }
        }
    }

    public getCalculatdValue(valuetype: string) {
        switch (valuetype) {
            case "now":
                return new moment();
            case "nextfullhour":
                let value = new moment();
                if (value.minute() == 0) {
                    return value;
                } else {
                    value.minute(0);
                    value.add(1, "h");
                    return value;
                }
        }
        return "";
    }

    /*
    * open an edit modal using the injecor from the provider
     */
    public edit(reload: boolean = false, componentSet: string = "") {
        // check if the user can edit
        if (!this.checkAccess("edit")) {
            return false;
        }

        // open the edit Modal
        this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
            if (editModalRef) {
                if (componentSet && componentSet != "") {
                    editModalRef.instance.componentSet = componentSet;
                }

                if (reload) {
                    editModalRef.instance.model.getData(false, "editview", false).subscribe(loaded => {
                        // start editing after it has been loaded
                        this.startEdit();
                    });
                } else {
                    // start Editing
                    this.startEdit();
                }
            }
        });
    }


    public duplicateCheck(fromModelData = false) {
        let responseSubject = new Subject<any>();
        if (fromModelData) {
            let _modeldata = this.data;
            _modeldata.id = this.id;
            this.backend.checkDuplicates(this.module, _modeldata)
                .subscribe(res => {
                    responseSubject.next(res);
                    responseSubject.complete();
                });
        } else {
            this.backend.getDuplicates(this.module, this.id)
                .subscribe(res => {
                    responseSubject.next(res);
                    responseSubject.complete();
                });
        }
        return responseSubject.asObservable();
    }

    /**
     * adds a message to the global model if ref is null else to the field itself
     * @param {string} type can be of value error | warning | notice
     * @param {string} message
     * @param {string} ref  can be any fieldname
     * @param {string} source can be any identifying string, by default it is "validation", so it can be erased only be validation
     * @returns {boolean}
     */
    private addMessage(type: "error" | "warning" | "notice", message: string, ref: string = null, source = "validation"): boolean {
        this._messages.push({
            type: type,
            message: message,
            reference: ref,
            source: source,
        });
        if (type == "error" && ref) {
            this.setFieldStatus(ref, "invalid", true);
        }
        this.messageChange$.emit(true);
        return true;
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
     * @param {string} ref    can be any fieldname
     * @param {string} type     can be of value error | warning | notice
     * @returns {any[]}
     */
    public getFieldMessages(ref: string, type?: "error" | "warning" | "notice") {
        let messages = this._messages.filter((e) => {
            return e.reference == ref && (!type || e.type == type)
        });
        if (messages.length > 0) {
            return messages;
        } else {
            return false;
        }
    }

    public resetFieldMessages(ref: string, type?: "error" | "warning" | "notice", source?: string): boolean {
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

    private resetMessages(type?: string, source: string = "validation"): boolean {
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

    /**
     * overwrites this instance of model with another instance of model...
     * @param model {model}
     * @returns {boolean}
     */

    /*
    public overwrite(model: model): boolean {
        for(let prop in model) {
            if(model.hasOwnProperty(prop)) {
                this[prop] = model[prop];
            }
        }
        return true;
    }
    */

    private isFieldARelationLink(field_name) {
        try {
            if (this.fields[field_name].type == "link") {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * returns an array of records instead of the object stored in the data...
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
    }

    /**
     * adds an array of records to the given link name
     * @param {string} relation_link_name
     * @param {any[]} records
     * @param {boolean} overwrite default true, if false, it will ignore records which are already set
     * @returns {boolean}
     */
    public addRelatedRecords(relation_link_name: string, records: any[], overwrite = true): boolean {
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
        return true;
    }

}
