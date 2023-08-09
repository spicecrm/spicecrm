/**
 * @module services
 */
import {catchError, from, Observable, of, Subject, switchMap, throwError} from "rxjs";
import {
    ComponentRef,
    EventEmitter,
    Injectable,
    Injector,
    ViewContainerRef
} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Router } from "@angular/router";
import {LocationStrategy} from "@angular/common";
import {session} from "./session.service";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {SystemComponentContainer} from "../systemcomponents/components/systemcomponentcontainer";
import {map} from "rxjs/operators";
import {SystemNavigationCollector} from "../systemcomponents/components/systemnavigationcollector";
import {SystemComponentMissing} from "../systemcomponents/components/systemcomponentmissing";
import {ComponentType} from "@angular/cdk/overlay";

declare var _;

@Injectable({
    providedIn: 'root'
})
export class metadata {
    // modules: Array<any> = [];
    public role: string = "";

    constructor(
        public http: HttpClient,
        public session: session,
        public configuration: configurationService,
        public router: Router,
        public broadcast: broadcast,
        public Injector: Injector
    ) {
        this.broadcast.message$.subscribe(msg => this.handleMessage(msg));
    }

    get actionSets() {
        return this.configuration.getData('actionsets');
    }

    get componentDefaultConfigs() {
        return this.configuration.getData('componentdefaultconfigs');
    }

    get componentModuleConfigs() {
        return this.configuration.getData('componentmoduleconfigs');
    }

    get moduleDirectory(): {[key: string]: {id: string, module: string, path: string, factories?: any[]}} {
        return !this.configuration.getData('modules') ? {} : this.configuration.getData('modules');
    }

    get componentDirectory() {
        return !this.configuration.getData('components') ? {} : this.configuration.getData('components');
    }

    get componentSets() {
        return this.configuration.getData('componentsets');
    }

    get routes() {
        return this.configuration.getData('routes');
    }

    get scripts() {
        return this.configuration.getData('scripts');
    }

    get fieldSets() {
        return this.configuration.getData('fieldsets');
    }

    get validationRules() {
        return this.configuration.getData('validationrules');
    }

    get fieldDefs() {
        return this.configuration.getData('fielddefs');
    }

    get fieldTypeMappings() {
        return this.configuration.getData('fieldtypemappings');
    }

    get fieldStatusNetworks() {
        return this.configuration.getData('fieldstatusnetworks');
    }

    get moduleDefs() {
        return this.configuration.getData('moduledefs');
    }

    get moduleFilters() {
        return this.configuration.getData('modulefilters');
    }

    /**
     * all the system roles available
     */
    get sysroles() {
        return this.configuration.getData('sysroles');
    }

    /**
     * the system roles assigned to current user
     */
    get roles() {
        return this.configuration.getData('roles');
    }

    get rolemodules() {
        return this.configuration.getData('rolemodules');
    }

    get copyrules() {
        return this.configuration.getData('copyrules');
    }

    get htmlStyleData() {
        return this.configuration.getData('htmlstyles');
    }

    /**
     * the countries from syscountries tabale
     */
    get countries() {
        return this.configuration.getData('countries');
    }

    /*
    * dynamically add routes from this.routes with a route container hat will handle the dynamic routes
     */
    public addRoutes() {

        this.routes.forEach(route => {
            this.router.config.unshift({
                path: route.path,
                component: SystemNavigationCollector,
                canActivate: [aclCheck]
            });

            // add the same for the tabbed browser
            this.router.config.unshift({
                path: 'tab/:tabid/' + route.path,
                component: SystemNavigationCollector,
                canActivate: [aclCheck]
            });
        });
    }

    /*
     * function to add a Component direct
     *
     * no system container is rendered. This is faster but can cause that the sequence is mixed up
     */
    public addComponentDirect(componentName: string, vcr: ViewContainerRef, injector?: Injector): Observable<ComponentRef<any>> {

        const renderError = this.hasRenderError(componentName, vcr);

        if (renderError) {
            this.renderMissingComponent(vcr, componentName);
            console.error(renderError);
            return throwError(() => renderError);
        }

        const resSubject = new Subject<ComponentRef<any>>();

        const module = this.componentDirectory[componentName].module;
        const moduleMetadata = {
            name: this.moduleDirectory[module].module,
            path: this.moduleDirectory[module].path.replace('app/', '')
        };

        this.renderComponent(moduleMetadata, componentName, vcr, [], injector).subscribe({
            next: componentRef => {
                componentRef.instance.self = componentRef;
                resSubject.next(componentRef);
                resSubject.complete();
            },
            error: err => {
                 this.renderMissingComponent(vcr, componentName);
                resSubject.error(err);
            }
        });

        return resSubject.asObservable();
    }

    /**
     * check if the component exists in the config directory
     * @param component
     */
    public checkComponent(component: string) {
        return !!this.componentDirectory[component];
    }

    /**
     * import the component file and return the factory
     * @private
     * @param moduleMetadata
     */
    public async importModule(moduleMetadata: { name: string, path: string }): Promise<any> {

        return import(
            /*
               webpackInclude: /^\.(\\|\/)[^\\|\/]+(\\|\/)?(\\|\/)[^\\|\/]+?$|(\\|\/)(addcomponents|admincomponents|globalcomponents|objectcomponents|objectfields|portalcomponents|systemcomponents|workbench)(\\|\/)[^\\|\/]+?$|(\\|\/)(modules|include|custom)(\\|\/)[^\\|\/]+(\\|\/)?(\\|\/)[^\\|\/]+?$/
             */
            `src/${moduleMetadata.path}.ts`)
            .then(m => m[moduleMetadata.name]);
    }

    private renderMissingComponent(vcr: ViewContainerRef, ComponentName: string) {
        const systemComponentMissing = vcr.createComponent(SystemComponentMissing);
        systemComponentMissing.instance.component = ComponentName;
    }

    /**
     * load component type from module or from cached factories
     * @param moduleMetadata
     * @param componentName
     * @private
     */
    public loadComponentType(moduleMetadata: { name: string, path: string }, componentName: string): Observable<ComponentType<any>> {

        const notDeclaredMsg = `Component ${componentName} in the config is not declared in the angular ngModule.`;

/*        if (this.moduleDeclarations[moduleMetadata.name]) {

            const componentType = this.moduleDeclarations[moduleMetadata.name].find(f => f.name == componentName);

            if (!componentType) {
                return throwError(() => notDeclaredMsg)
            }
            return from(
                Promise.resolve(componentType)
            );
        }*/

        return from(
            this.importModule(moduleMetadata)
        ).pipe(
            catchError(() =>
                throwError(() => `Could not find the module file for path ${moduleMetadata.path}. Check if the module file exists or use a correct module path.`)
            ),
            switchMap(module => {

                if (!module) {
                    return throwError(() => `Module name ${moduleMetadata.name} in the config does not match the class name in the module file.`);
                }

                let componentType;

                Object.keys(module).some(k => {
                    if (!module[k].hasOwnProperty('declarations')) return false;
                    componentType = module[k].declarations.find(f => f.name == componentName);
                    return true;
                });

                return of(componentType);

            }));
    }

    /**
     * render the component to the view
     * @param moduleMetadata
     * @param componentName
     * @param vcr
     * @param data
     * @param injector
     * @private
     */
    public renderComponent(moduleMetadata: { name: string, path: string }, componentName: string, vcr: ViewContainerRef, data?: { property: string, value: any }[], injector?: Injector): Observable<ComponentRef<any>> {

        return this.loadComponentType(moduleMetadata, componentName)
            .pipe(
                map(componentType => {

                    const componentRef = vcr.createComponent(componentType, {injector});

                    // pass data to the component instance
                    data.forEach(e => componentRef.instance[e.property] = e.value);

                    componentRef.changeDetectorRef.markForCheck();
                    return componentRef;
                }),
            );

    }

    /**
     * return the possible rendering error and render the system component missing it is a misconfiguration
     * @param ComponentName
     * @param vcr
     * @private
     */
    public hasRenderError(ComponentName: string, vcr: ViewContainerRef): string {
        if (!vcr) {
            return 'ViewContainerRef was passed is undefined';
        }

        if (!this.componentDirectory[ComponentName] || !this.componentDirectory[ComponentName].module) {

            return `misconfiguration for component ${ComponentName} in object repository`;
        }

        return undefined;
    }

    /**
     * load the system component container
     * @param component
     * @param vcr
     * @param injector
     * @return ViewContainerRef of SystemComponentContainer
     * @private
     */
    public loadComponentContainer(component: string, vcr: ViewContainerRef, injector: Injector): ComponentRef<SystemComponentContainer> {

        const systemComponentContainer = vcr.createComponent(SystemComponentContainer, {injector});

        systemComponentContainer.instance.containerComponent = component;

        return systemComponentContainer;
    }

    /*
     * add a Component dynamically, by placing a container element wrapper first and inside the component itself
     */
    public addComponent(componentName: string, vcr: ViewContainerRef, injector?: Injector): Observable<ComponentRef<any>> {

        const renderError = this.hasRenderError(componentName, vcr);

        if (renderError) {
            this.renderMissingComponent(vcr, componentName);
            return throwError(() => renderError);
        }

        const resSubject = new Subject<ComponentRef<any>>();

        const componentContainer = this.loadComponentContainer(componentName, vcr, injector);

        componentContainer.instance.containerRef.subscribe(vcr => {
            componentContainer.changeDetectorRef.detectChanges();
            this.addComponentDirect(componentName, vcr).subscribe(componentRef => {
                resSubject.next(componentRef);
                resSubject.complete();
            })
        });

        componentContainer.instance.loaded = true;
        componentContainer.changeDetectorRef.detectChanges();
        componentContainer.changeDetectorRef.markForCheck();

        return resSubject.asObservable();
    }

    /*
     * getter functions
     */
    public getComponentSet(componentSetId) {
        return this.componentSets[componentSetId];
    }

    public getAllComponentsets() {
        try {
            return this.componentSets;
        } catch (e) {
            return "";
        }
    }

    public addComponentSet(id, module, name, type = "custom") {
        this.componentSets[id] = {
            name: name,
            module: module,
            type: type,
            items: []
        };
    }

    public getRawComponentSets() {
        return this.componentSets;
    }

    public getComponentSets(module = "") {
        let retComponentSets: any[] = [];

        for (let componenset in this.componentSets) {
            if (module !== "" && this.componentSets[componenset].module !== module) {
                continue;
            }

            retComponentSets.push({
                id: componenset,
                name: this.componentSets[componenset].name,
                module: this.componentSets[componenset].module,
                type: this.componentSets[componenset].type
            });
        }

        retComponentSets.sort((a, b) => {
            if (!a.name) return 1;
            return a.name.localeCompare(b.name);
        });

        return retComponentSets;
    }

    public getComponentSetObjects(componentSetId) {
        try {
            return this.componentSets[componentSetId].items;
        } catch (e) {
            return [];
        }
    }

    /**
     * adds a component to a componentset
     *
     * @param id
     * @param componentset
     * @param item
     * @param componentconfig
     */
    public addComponentToComponentset(id, componentset, item, componentconfig = {} ) {
        this.componentSets[componentset].items.push({
            id: id,
            component: item,
            componentconfig: componentconfig,
            sequence: 0
        });

        let i = 0;
        for (let ocmponent of this.componentSets[componentset].items) {
            ocmponent.sequence = i;
            i++;
        }
    }

    public getRawFieldSets() {
        return this.fieldSets;
    }

    /*
     * get the definitiopn for the related links
     */

    public getFieldSets(module: string = "", filter: string = "") {
        let retFieldsets: any[] = [];

        for (let fieldset in this.fieldSets) {
            if (module !== "" && this.fieldSets[fieldset].module !== module) {
                continue;
            }

            retFieldsets.push({
                id: fieldset,
                name: this.fieldSets[fieldset].name,
                module: this.fieldSets[fieldset].module,
                type: this.fieldSets[fieldset].type
            });
        }

        retFieldsets.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });

        return retFieldsets;
    }

    /**
     *
     * @param string fieldset_id
     * @returns {any}
     */
    public getFieldset(fieldset_id) {
        try {
            return this.fieldSets[fieldset_id];
        } catch (e) {
            return "";
        }
    }

    public getAllFieldsets() {
        try {
            return this.fieldSets;
        } catch (e) {
            return "";
        }
    }

    public setFieldset(fieldset_id, params) {
        this.fieldSets[fieldset_id].name = params.name;
        this.fieldSets[fieldset_id].package = params.package;
        this.configuration.setData('fieldsets', this.fieldSets);
    }

    public addFieldset(id, module, name, type = "custom", items = []) {
        this.fieldSets[id] = {
            items: items,
            module: module,
            name: name,
            type: type
        };
        this.configuration.setData('fieldsets', this.fieldSets);
    }

    public addFieldsetToFieldset(id, parent, itemid, config: any = {}) {
        this.fieldSets[parent].items.push({
            id: id,
            fieldset: itemid,
            fieldconfig: config,
            sequence: 0
        });

        let i = 0;
        for (let item of this.fieldSets[parent].items) {
            item.sequence = i;
            i++;
        }

        this.configuration.setData('fieldsets', this.fieldSets);
    }

    public addFieldToFieldset(id, parent, field, config: any = {}) {
        this.fieldSets[parent].items.push({
            id: id,
            field: field,
            fieldconfig: config,
            sequence: 0
        });

        let i = 0;
        for (let item of this.fieldSets[parent].items) {
            item.sequence = i;
            i++;
        }

        this.configuration.setData('fieldsets', this.fieldSets);
    }

    public removeFieldsetItem(parent, item) {
        let remIndex = false;
        this.fieldSets[parent].items.some((curitem, curindex) => {
            if (curitem.id == item.id) {
                remIndex = curindex;
                return true;
            }
        });

        if (remIndex !== false) {
            this.fieldSets[parent].items.splice(remIndex, 1);
            let i = 0;
            for (let thisitem of this.fieldSets[parent].items) {
                thisitem.sequence = i;
                i++;
            }

            this.configuration.setData('fieldsets', this.fieldSets);
            return true;
        } else {
            return false;
        }
    }

    /**
     * returns the name of a fieldset
     *
     * @param fieldset the id of the fieldset
     */
    public getFieldsetName(fieldset) {
        try {
            return this.fieldSets[fieldset].name;
        } catch (e) {
            return "";
        }
    }

    /**
     * flattens out a fieldset and returns all fields. If an item in the fieldset is a fieldset this is recursively flattened out
     *
     * @param fieldset the id of the fieldset
     */
    public getFieldSetFields(fieldset: string, parents: string = ''): any[] {
        if (this.fieldSets[fieldset]) {

            let fields = [];
            for (let fieldsetitem of this.fieldSets[fieldset].items) {
                if (fieldsetitem.field) {
                    fields.push(fieldsetitem);
                } else if (fieldsetitem.fieldset) {
                    // check for recursion
                    if (parents.indexOf(fieldset) < 0) {
                        // resolve feidlset adding the current fieldset to the parents string
                        fields = fields.concat(this.getFieldSetFields(fieldsetitem.fieldset, parents + ':' + fieldset));
                    }
                }
            }
            return fields;

        } else {
            return [];
        }
    }

    /**
     * get the items of a fieldset which is a mix of fieldsets and fields
     *
     * @param fieldset the id of the fieldset
     */
    public getFieldSetItems(fieldset) {
        if (this.fieldSets[fieldset]) {
            return this.fieldSets[fieldset].items;
        } else {
            return [];
        }
    }

    /**
     * returns the name of the label of a fields. This does not return the translation. For that the language service must be queried resp is there a method on the language service
     *
     * @param module the name of the module
     * @param field the name of the field
     */
    public getFieldlabel(module, field) {
        try {
            return this.fieldDefs[module][field].vname ? this.fieldDefs[module][field].vname : field;
        } catch (e) {
            return field;
        }
    }

    /**
     * returns the helpText of a field. This does not return the translation. For that the language service must be queried resp is there a method on the language service
     *
     * @param module the name of the module
     * @param field the name of the field
     */
    public getFieldHelpText(module, field) {
        try {
            return this.fieldDefs[module][field].popupHelp;
        } catch (e) {
            return null;
        }
    }

    /**
     * Has a module a specific field?
     *
     * @param module the name of the module
     * @param field the name of the field
     * @return true or false
     */
    public hasField(module: string, field: string): boolean {
        return true && this.fieldDefs[module] && this.fieldDefs[module][field];
    }

    public getAppModules() {
        // convert object to array...
        let ret = [];
        for (let id in this.moduleDirectory) {
            if (this.moduleDirectory.hasOwnProperty(id)) {
                ret.push(this.moduleDirectory[id]);
            }
        }
        return ret;
    }

    /**
     * returns the definition data for thge module
     *
     * @param module the name of the module
     */
    public getModuleDefs(module) {
        // changed so it can use the moduel name or the sysmoduleid
        return this.moduleDefs[module] ? this.moduleDefs[module] : this.moduleDefs[this.getModuleById(module)];
    }

    /**
     * returns for a given modulename if the duplicate check is active for the module
     *
     * @param module the name of the module
     */
    public getModuleDuplicatecheck(module) {
        try {
            return this.moduleDefs[module].duplicatecheck === "1" || this.moduleDefs[module].duplicatecheck === "2";
        } catch (e) {
            return false;
        }
    }

    /**
     * returns for a given modulename if the duplicate check is active for the module
     *
     * @param module the name of the module
     */
    public getModuleDuplicatecheckOnChange(module) {
        try {
            return this.moduleDefs[module].duplicatecheck === "1";
        } catch (e) {
            return false;
        }
    }

    /**
     * returns a list of all modules defined in teh current config
     *
     * @return an array of modulenames
     */
    public getModules(): string[] {
        let modules = [];

        for (let module in this.moduleDefs) {
            modules.push(module);
        }

        return modules;
    }

    /**
     * returns the global search modules
     */
    public getGlobalSearchModules() {
        let modules = [];

        for (let module in this.moduleDefs) {
            if (this.moduleDefs[module].ftsglobalsearch) {
                modules.push(module);
            }
        }

        return modules;
    }

    /**
     * returns the phone search modules
     */
    public getPhoneSearchModules() {
        let modules = [];

        for (let module in this.moduleDefs) {
            if (this.moduleDefs[module].ftsphonesearch) {
                modules.push(module);
            }
        }

        return modules;
    }

    /**
     * gets the module by the sysmoduleid
     *
     * @param sysmoudleid
     */
    public getModuleById(sysmoudleid: string): string {
        for (let module in this.moduleDefs) {
            if (this.moduleDefs[module].id == sysmoudleid) {
                return module;
            }
        }

        return '';
    }

    /**
     * returns the name of the icon to be used for the module
     *
     * @param module the name of the module
     */
    public getModuleIcon(module: string) {
        try {
            return this.moduleDefs[module].icon;
        } catch (e) {
            return false;
        }
    }

    /**
     * returns the singular label for a module
     *
     * @param module
     */
    public getModuleSingular(module: string) {
        try {
            return this.moduleDefs[module].singular;
        } catch (e) {
            return module;
        }
    }

    /**
     * returns the module from the singualr
     * @param singular
     */
    public getModuleFromSingular(singular: string) {
        let module = "";
        for (let thismodule in this.moduleDefs) {
            if (this.moduleDefs[thismodule].singular == singular) {
                module = thismodule;
            }
        }
        return module;
    }

    /**
     * returns if a module is active in the tracker
     *
     * @param module
     */
    public getModuleTrackflag(module): boolean {
        try {
            return parseInt(this.moduleDefs[module].track, 10) ? true : false;
        } catch (e) {
            return false;
        }
    }

    /**
     * to read module field defs
     */
    public getModuleFields(module: string): any {
        try {
            return this.fieldDefs[module] ? this.fieldDefs[module] : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * returns all fields that are relevant for a duplicate check for the given module
     *
     * @param module the module object that the fields are supposed to be returned for
     */
    public getModuleDuplicateCheckFields(module: string): any {
        let dupfields = [];
        let fields = this.getModuleFields(module);
        for (let field in fields) {
            if (fields[field].duplicatecheck) dupfields.push(field);
        }
        return dupfields;
    }

    public getModuleValidations(module: string) {
        try {
            return this.validationRules[module].validations;
        } catch (e) {
            return [];
        }
    }

    public getModuleMenu(module: string) {
        try {
            let menuitems = [];

            if (this.moduleDefs[module].actionset) {
                menuitems = this.getActionSetItems(this.moduleDefs[module].actionset);
            }

            return menuitems;
        } catch (e) {
            return [];
        }
    }

    /**
     * returns the module list types for a given module
     *
     * @param module
     */
    public getModuleListTypes(module: string) {
        try {
            return this.moduleDefs[module].listtypes;
        } catch (e) {
            return [];
        }
    }

    /**
     * adds a specific new module list type
     *
     * @param module
     * @param listTypeData
     */
    public addModuleListType(module: string, listTypeData: any) {
        this.moduleDefs[module].listtypes.push(listTypeData);
        this.configuration.setData('moduledefs', this.moduleDefs);
    }

    /**
     * updates the module list type
     *
     * @param module
     * @param listTypeData
     */
    public updateModuleListType(module: string, listTypeData: any) {
        this.moduleDefs[module].listtypes.some(listtype => {
            if (listtype.id == listTypeData.id) {
                for (let key in listTypeData) {
                    if (listTypeData.hasOwnProperty(key)) {
                        listtype[key] = listTypeData[key];
                    }
                }
                this.configuration.setData('moduledefs', this.moduleDefs);
                return true;
            }
        });
    }

    /**
     * deletes the module listtype from the metadata
     *
     * @param module
     * @param listtype
     */
    public deleteModuleListType(module: string, listtype: string) {
        let typeIndex = this.moduleDefs[module].listtypes.findIndex(ltype => ltype.id == listtype);
        if (typeIndex >= 0) {
            this.moduleDefs[module].listtypes.splice(typeIndex, 1);
        }
        this.configuration.setData('moduledefs', this.moduleDefs);
        return this.moduleDefs[module].listtypes;
    }

    /**
     * returns the ggregate settings for a module
     *
     * @param module
     */
    public getModuleAggregates(module: string) {
        return this.moduleDefs[module].ftsaggregates;
    }

    /**
     * returns the field defs for a given module
     * @param module
     * @param field
     */
    public getFieldDefs(module: string, field: string) {
        try {
            return this.fieldDefs[module][field];
        } catch (e) {
            return "varchar";
        }
    }

    /**
     * returns if a modulöe is status managed by a status network defined
     *
     * @param module
     */
    public checkStatusManaged(module: string) {
        for (let field in this.fieldDefs[module]) {
            if (this.getFieldDefs(module, field).options && this.fieldStatusNetworks[this.getFieldDefs(module, field).options]) {
                return {
                    statusField: this.getFieldDefs(module, field).name,
                    statusNetwork: this.fieldStatusNetworks[this.getFieldDefs(module, field).options]
                };
            }
        }

        return false;
    }

    /**
     * returns the type for the field
     *
     * @param module the module
     * @param field the fieldname
     */
    public getFieldType(module: string, field: string) {
        try {
            return this.fieldDefs[module][field].type;
        } catch (e) {
            return "varchar";
        }
    }

    /**
     * returns the source information for the field (useful to check if field is non-db)
     *
     * @param module the module
     * @param field the fieldname
     */
    public getFieldSource(module: string, field: string) {
        try {
            return this.fieldDefs[module][field].source;
        } catch (e) {
            return "";
        }
    }

    public getFieldOptions(module: string, field: string) {
        try {
            return this.fieldDefs[module][field].options;
        } catch (e) {
            return false;
        }
    }

    public getFieldRequired(module: string, field: string) {
        try {
            return this.fieldDefs[module][field].required;
        } catch (e) {
            return false;
        }
    }

    /**
     get modules from Repository
     */
    public getSystemModules() {
        let modArray = [];

        for (let module in this.moduleDirectory) {
            modArray.push(this.moduleDirectory[module]);
        }

        modArray.sort((a, b) => {
            return a.module > b.module ? 1 : -1;
        });

        return modArray;
    }

    /**
     get module by component
     */
    public getSystemModuleByComponent(comp) {
        for (let component in this.componentDirectory) {
            if (component == comp) {
                return this.componentDirectory[component].module;
            }
        }
        return null;
    }

    /**
     get components from Repository
     */
    public getSystemComponents(module?) {
        let compArray = [];

        for (let component in this.componentDirectory) {
            if (!module || module == this.componentDirectory[component].module) {
                compArray.push(this.componentDirectory[component]);
            }
        }

        compArray.sort((a, b) => {
            return a.component > b.component ? 1 : -1;
        });

        return compArray;
    }

    /**
     get a components config option
     */
    public getComponentConfigOptions(component) {
        try {
            return this.componentDirectory[component].componentconfig;
        } catch (e) {
            return {};
        }
    }

    /**
     get all module specific options that are available
     */
    public getComponentConfigurations(module = "*") {
        if (module === "*") {
            return this.componentDefaultConfigs;
        } else {
            return this.componentModuleConfigs[module] ? this.componentModuleConfigs[module] : {};
        }
    }

    /**
     get the component config
     */
    public getComponentConfig(component: string = "", module: string = "", role = "") {

        if (role === "") {
            role = this.role ? this.role : "*";
        }

        if (module != "" && this.componentModuleConfigs[module] && this.componentModuleConfigs[module][component] && this.componentModuleConfigs[module][component][role]) {
            return this.componentModuleConfigs[module][component][role];
        } else if (module != "" && this.componentModuleConfigs[module] && this.componentModuleConfigs[module][component] && this.componentModuleConfigs[module][component]["*"]) {
            return this.componentModuleConfigs[module][component]["*"];
        } else if (this.componentDefaultConfigs[component] && this.componentDefaultConfigs[component][role]) {
            return this.componentDefaultConfigs[component][role];
        } else if (this.componentDefaultConfigs[component] && this.componentDefaultConfigs[component]["*"]) {
            return this.componentDefaultConfigs[component]["*"];
        } else {
            return {};
        }
    }

    public getModuleDefaultComponentConfigByUsage(module: string, usage: string) {
        let component = "";
        switch (usage) {
            case "list":
                component = "ObjectList";
                break;
            case "details":
                component = "ObjectRecordDetails";
                break;
        }
        return this.getComponentConfig(component, module);
    }

    public getRawActionSets() {
        return this.actionSets;
    }

    /*
     * get the action set
     */
    public getActionSets(module = "") {
        let retActionSets: any[] = [];

        for (let actionset in this.actionSets) {
            if (module !== "" && (this.actionSets[actionset].module !== module)) {
                continue;
            }

            retActionSets.push({
                id: actionset,
                name: this.actionSets[actionset].name,
                module: this.actionSets[actionset].module,
                type: this.actionSets[actionset].type,
                package: this.actionSets[actionset].package,
                actions: this.actionSets[actionset].actions
            });
        }

        retActionSets.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });

        return retActionSets;
    }

    public getActionSet(actionsSetId) {
        return this.actionSets[actionsSetId];
    }

    public getActionSetItems(actionset) {
        try {
            return this.actionSets[actionset].actions;
        } catch (e) {
            return [];
        }
    }

    public setActionset(actionset_id, params) {
        this.actionSets[actionset_id].name = params.name;
        this.actionSets[actionset_id].package = params.package;

        this.configuration.setData('actionsets', this.actionSets);
    }

    public setActionSet(actionset_id, params) {
        this.actionSets[actionset_id] = {
            id: actionset_id,
            module: params.module,
            name: params.name,
            package: params.package,
            version: params.version,
            actions: params.actions,
            type: params.type
        };

        this.configuration.setData('actionsets', this.actionSets);
    }

    public setActionSetItems(actionset_id, actions) {
        this.actionSets[actionset_id].actions = actions;

        this.configuration.setData('actionsets', this.actionSets);
    }

    public addActionset(id, module, name, type = "custom", items = []) {
        this.actionSets[id] = {
            items: items,
            module: module,
            name: name,
            type: type
        };

        this.configuration.setData('actionsets', this.actionSets);
    }

    public removeActionset(id) {
        delete this.actionSets[id];

        this.configuration.setData('actionsets', this.actionSets);
    }

    public removeActionsetItem(parent, item) {
        let remIndex = false;
        this.actionSets[parent].items.some((curitem, curindex) => {
            if (curitem.id == item.id) {
                remIndex = curindex;
                return true;
            }
        });

        if (remIndex !== false) {
            this.actionSets[parent].items.splice(remIndex, 1);
            let i = 0;
            for (let thisitem of this.actionSets[parent].items) {
                thisitem.sequence = i;
                i++;
            }

            this.configuration.setData('actionsets', this.actionSets);
            return true;
        } else {
            return false;
        }

    }

    /**
     * returns the name of a actionset
     *
     * @param actionset the id of the actionset
     */
    public getActionsetName(actionset) {
        try {
            return this.actionSets[actionset].name;
        } catch (e) {
            return "";
        }
    }

    /*
     * get all module filters
     */
    public getModuleFilters(module = "") {
        let retModuleFilters = [];
        for (let ModuleFilter in this.moduleFilters) {
            if (this.moduleFilters.hasOwnProperty(ModuleFilter)) {
                if (module !== "" && this.moduleFilters[ModuleFilter].module !== module) {
                    continue;
                }
                retModuleFilters.push(this.moduleFilters[ModuleFilter]);
            }
        }
        retModuleFilters.sort((a, b) => a.name - b.name);
        return retModuleFilters;
    }

    /**
     * @param filterId: string
     * @returns {any}
     */
    public getModuleFilter(filterId) {
        try {
            return this.moduleFilters[filterId];
        } catch (e) {
            return "";
        }
    }

    /**
     * @param filterId: string
     * @param name: object
     * @param module: object
     * @param type: object
     */
    public setModuleFilter(id, name, module, type = 'custom') {
        if (!this.moduleFilters) this.configuration.setData('modulefilters', {});
        this.moduleFilters[id] = {
            id,
            name,
            module,
            type
        };

        this.configuration.setData('modulefilters', this.moduleFilters);
    }

    /**
     * @param filterId: string
     */
    public removeModuleFilter(filterId) {
        delete this.moduleFilters[filterId];

        this.configuration.setData('modulefilters', this.moduleFilters);
    }

    /**
     * checkl if teh user has access to the module.
     *
     * @param module the name of the module
     * @param action a specific action. if not specified checks if the module exists for the user
     */
    public checkModuleAcl(module, action?) {
        try {
            if (action) {
                return this.moduleDefs[module].acl[action];
            } else {
                return !!this.moduleDefs[module];
            }
        } catch (e) {
            return false;
        }

    }

    /**
     * get available roles
     */
    public getRoles() {
        return this.roles;
    }

    /**
     * get all available roles
     */
    public getSysRoles() {
        return this.sysroles;
    }

    public getActiveRole(): any {
        let currentRole = {};

        if (this.roles) {
            this.roles.some(role => {
                if (this.role == role.id) {
                    currentRole = role;
                    return true;
                }
            });
        }

        return currentRole;
    }

    /**
     * sets the active role and returns true if successful or false if role was not found
     *
     * @param roleid
     */
    public setActiveRole(roleid) {
        if (this.roles.find(r => r.id == roleid)){
            this.role = roleid;
            return true;
        }
        return false;
    }

    public getRoleModules(menu = false) {
        let modules = [];

        if (this.rolemodules[this.role]) {
            for (let rolemodule of this.rolemodules[this.role]) {
                if ((menu === false || rolemodule.sequence !== null) && this.moduleDefs[rolemodule.module] && this.moduleDefs[rolemodule.module].visible && (!this.moduleDefs[rolemodule.module].visibleaclaction || (this.moduleDefs[rolemodule.module].visibleaclaction && this.checkModuleAcl(rolemodule.module, this.moduleDefs[rolemodule.module].visibleaclaction))) && this.moduleDefs[rolemodule.module].acl.list) {
                    modules.push(rolemodule.module);
                }
            }
        }

        return modules;
    }

    /**
     * return the system copy rules
     * @param from
     * @param to
     */
    public getCopyRules(from: string, to: string): { fromfield: string, tofield: string, fixedvalue: string, calculatedvalue: string, params: object }[] {
        const copyRules = this.copyrules[from] && this.copyrules[from][to] ? this.copyrules[from][to] : [];

        copyRules.forEach(copyRule => {

            if (!copyRule.params || _.isObject(copyRule.params)) return;

            try {
                copyRule.params = JSON.parse(copyRule.params);
            } catch (e) {
                copyRule.params = {};
            }
        });

        return copyRules;
    }

    /*
     for the field typoe handling
     */
    public getFieldTypes() {
        let fieldTypes: string[] = [];

        for (let fieldType in this.fieldTypeMappings) {
            fieldTypes.push(fieldType);
        }

        return fieldTypes;
    }

    public getFieldTypeComponent(fieldtype) {
        return this.fieldTypeMappings[fieldtype];
    }

    /**
     * returns the details for a given route
     * @param route
     */
    public getRouteDetails(route) {
        return this.routes?.sort((a, b) => {
            return a.path.split(':').length > b.path.split(':').length ? 1 : -1;
        }).find(routeDetails => {
            if (routeDetails.path == route) {
                return true;
            } else if (route.split("/").length == routeDetails.path.split("/").length) {
                let routeArray = route.split("/");
                let matchArray = routeDetails.path.split("/");
                let matched = true;

                let i = 0;
                while (i < routeArray.length && matched) {
                    if (matchArray[i].substring(0, 1) !== ":" && matchArray[i] !== routeArray[i]) {
                        matched = false;
                    }
                    i++;
                }

                if (matched) {
                    return true;
                }
            }
        });
    }

    /*
    * for the route handling
     */

    public getRouteComponent(route) {
        return this.routes ? this.routes.find(routeDetails => {
            if (routeDetails.path == route) {
                return true;
            } else if (route.split("/").length == routeDetails.path.split("/").length) {
                let routeArray = route.split("/");
                let matchArray = routeDetails.path.split("/");
                let matched = true;

                let i = 0;
                while (i < routeArray.length && matched) {
                    if (matchArray[i].substring(0, 1) !== ":" && matchArray[i] !== routeArray[i]) {
                        matched = false;
                    }
                    i++;
                }

                if (matched) {
                    return true;
                }
            }
        })?.component : false;
    }

    /*
    * check if the module has tagging enabled
     */
    public checkTagging(module) {
        try {
            return this.moduleDefs[module].tagging ? true : false;
        } catch (e) {
            return false;
        }
    }

    /**
     * @deprecated shuld be replaced with libloader service
     *
     * Lib Loading
     */

    public loadLibs(...scripts: string[]): Observable<any> {
        let observables: Observable<any>[] = [];
        scripts.forEach((script) => {
            observables.push(this.loadLib(script));
        });

        let sub = new Subject<void>();
        let cnt = 0;
        for (let o of observables) {
            o.subscribe(
                (res) => {
                    cnt++;
                },
                (err) => {
                    cnt++;
                    console.error(err);
                    sub.error(err);
                },
                () => {
                    if (cnt == observables.length) {
                        sub.next();
                        sub.complete();
                    }
                }
            );
        }
        // is needed in case of scripts are already loaded and completed before the subject can be subscribed...
        if (cnt == observables.length) {
            return of(sub);
        } else {
            return sub.asObservable();
        }
    }

    public isLibLoaded(name): boolean {
        if (this.scripts[name]) {
            for (let lib of this.scripts[name]) {
                if (!lib.loaded) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    public getHtmlStylesheetCode(stylesheetId: string): string {
        return stylesheetId && this.htmlStyleData && this.htmlStyleData.stylesheets && _.isObject(this.htmlStyleData.stylesheets[stylesheetId]) && _.isString(this.htmlStyleData.stylesheets[stylesheetId].csscode) ? this.htmlStyleData.stylesheets[stylesheetId].csscode : "";
    }

    public getHtmlFormats(stylesheetId: string): any[] {
        if (!_.isObject(this.htmlStyleData.stylesheets[stylesheetId])) {
            console.log("HTML Styling: Unknown style sheet with ID " + stylesheetId + ".");
            return [];
        }
        if (!_.isArray(this.htmlStyleData.stylesheets[stylesheetId].formats)) {
            this.htmlStyleData.stylesheets[stylesheetId].formats = [];
        }
        // Styles are delivered by KREST as string, and must be converted to an array of objects (once). Now? Or has it already been done?
        if (!this.htmlStyleData.stylesheets[stylesheetId].stylesDecoded) {
            this.htmlStylesToObjects(stylesheetId);
        }
        return this.htmlStyleData.stylesheets[stylesheetId].formats;
    }

    public getHtmlStylesheetNames(): any[] {
        let stylesheets = [];
        for (let sheetId in this.htmlStyleData.stylesheets) {
            stylesheets.push({
                id: this.htmlStyleData.stylesheets[sheetId].id,
                name: this.htmlStyleData.stylesheets[sheetId].name
            });
        }
        return _.sortBy(stylesheets, "name");
    }

    public getHtmlStylesheetToUse(module: string, fieldname: string) {
        if (_.isObject(this.htmlStyleData.stylesheetsToUse[module]) && this.htmlStyleData.stylesheetsToUse[module][fieldname]) {
            return this.htmlStyleData.stylesheetsToUse[module][fieldname];
        } else {
            return "";
        }
    }

    /**
     * get available countries
     */
    public getCountries() {
        return this.countries;
    }


    /**
     * message handler for workbench updates
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case "loader.completed":
                if (message.messagedata == 'loadRepository') {
                    // set Routes
                    this.addRoutes();
                }
                if (message.messagedata == 'loadModules') {
                    // set Role
                    this.roles.some(role => {
                        if (role.defaultrole == 1) {
                            this.role = role.id;
                            return true;
                        }
                    });

                    if (this.role === "" && this.roles.length > 0) {
                        this.role = this.roles[0].id;
                    }
                }
                break;
            case "metadata.updatefieldsets":
                for (let fieldset in message.messagedata.add) {
                    this.fieldSets[fieldset] = message.messagedata.add[fieldset];
                }
                for (let fieldset in message.messagedata.update) {
                    this.fieldSets[fieldset] = message.messagedata.update[fieldset];
                }
                for (let fieldset in message.messagedata.delete) {
                    delete (this.fieldSets[fieldset]);
                }
                break;
            case "metadata.updatecomponentsets":
                for (let componentset in message.messagedata.add) {
                    this.componentSets[componentset] = message.messagedata.add[componentset];
                }
                for (let componentset in message.messagedata.update) {
                    this.componentSets[componentset] = message.messagedata.update[componentset];
                }
                for (let componentset in message.messagedata.delete) {
                    delete (this.componentSets[componentset]);
                }
                break;
            default:
                break;
        }
    }

    /**
     * this function is used recursively to load scripts serially, one after the other
     * @param {string} name
     * @returns {Observable<object>}
     */
    public loadLib(name: string): Observable<any> {
        let sub = new Subject<any>();

        // error if not found... (but how?)
        if (!this.scripts[name]) {
            return of({script: name, loaded: false, status: "Unknown"});
        } else if (this.isLibLoaded(name)) {
            return of({script: name, loaded: true, status: "Already Loaded"});
        } else if (this.isLibLoading(name)) {
            for (let lib of this.scripts[name]) {
                if (lib.loading) {
                    lib.loading$.subscribe(
                        (res) => {
                            return this.loadLib(name).subscribe(
                                (res2) => {
                                    sub.next(res2);
                                    sub.complete();
                                }
                            );
                        }
                    );
                    return sub.asObservable();
                }
            }
        } else {
            // load script(s)
            for (let script of this.scripts[name]) {
                if (script.loaded) {
                    continue;
                }

                this.loadScript(script).subscribe(
                    (res) => {
                        this.loadLib(name).subscribe(
                            (res2) => {
                                sub.next(res2);
                                sub.complete();
                            }
                        ); // recall yourself to start loading the next script (if not finished) otherwise complete it...
                    }
                );
                return sub.asObservable();  // end loop here to not start loading the next script while the previous one isn"t finished yet!
            }
            sub.next({script: name, loaded: true, status: "Loaded"});
            sub.complete();
        }

        return sub.asObservable();
    }

    public loadScript(script) {
        let sub = new Subject<object>();

        script.loading = true;
        script.loading$ = new EventEmitter();

        let element: any = {};

        if (script.src.endsWith('.css')) {
            element = document.createElement("link");
            element.rel = "stylesheet";
            element.href = script.src;
        } else {
            element = document.createElement("script");
            element.type = "text/javascript";
            element.src = script.src;
        }
        if (element.readyState) {
            // IE
            element.onreadystatechange = () => {
                if (element.readyState === "loaded" || element.readyState === "complete") {
                    element.onreadystatechange = null;
                    script.loaded = true;
                    script.loading = false;
                    sub.next({script: script.src, loaded: true, status: "Loaded"});
                    sub.complete();
                    script.loading$.emit("loaded");
                }
            };
        } else {
            // Others
            element.onload = () => {
                script.loaded = true;
                script.loading = false;
                sub.next({script: script.src, loaded: true, status: "Loaded"});
                sub.complete();
                script.loading$.emit("loaded");
            };
        }

        element.onerror = (error: any) => {
            script.loading = false;
            sub.error({script: script.src, loaded: false, status: "Failed"});
            script.loading$.emit("failed");
        };
        document.getElementsByTagName("head")[0].appendChild(element);

        return sub.asObservable();
    }

    public isLibLoading(name): boolean {
        if (this.scripts[name]) {
            for (let lib of this.scripts[name]) {
                if (lib.loading) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    public htmlStylesToObjects(stylesheetId) {
        for (let format of this.htmlStyleData.stylesheets[stylesheetId].formats) {
            let styles;
            if (!_.isEmpty(format.styles)) {
                try {
                    styles = JSON.parse(format.styles);
                } catch (e) {
                    console.log("HTML Styling: Malformed style specification in table sysuihtmlformats (format id: " + format.id + ").");
                    styles = {};
                }
                format.styles = styles;
            } else {
                format.styles = null;
            }
        }
        this.htmlStyleData.stylesheets[stylesheetId].stylesDecoded = true;
    }

}


// tslint:disable-next-line:max-classes-per-file
@Injectable({
    providedIn: 'root'
})
export class aclCheck  {
    constructor(public metadata: metadata, public router: Router, public session: session, public configurationService: configurationService) {
    }

    public canActivate(route, state) {

        // if no session leave the redirect to the login handler
        if (!this.session || !this.session.authData.sessionId) {
            return false;
        }

        // • prevents non-admins from listing the user list
        // • prevents non-admins from accessing foreign user records
        // CR1000463: use spiceacl to enable listing and access foreign user records
        // keep BWC for old modules/ACL/ACLController.php
        let _aclcontroller = this.configurationService.getSystemParamater('aclcontroller');
        if (_aclcontroller && _aclcontroller != 'spiceacl') {
            if (route.params.module === 'Users' && (!route.params.id || route.params.id != this.session.authData.userId) && !this.session.authData.admin) {
                return false;
            }
        }

        // if ( route.params.module === 'Users' && this.session.authData.portalOnly ) return false; // prevents "portal only users" from listing the user list
        if (route.params.module && route.params.module != "Home" && !this.metadata.checkModuleAcl(route.params.module, route.data.aclaction)) {
            this.router.navigate(["/modules/Home"]);
            return false;
        } else {
            return true;
        }
    }
}


// tslint:disable-next-line:max-classes-per-file
@Injectable({
    providedIn: 'root'
})
export class noBack  {

    public navigatingBack: boolean = false;

    constructor(public location: LocationStrategy, public broadcast: broadcast) {
        // catch the popstate event
        this.location.onPopState(() => {
            this.navigatingBack = true;
        });
    }

    public canDeactivate(): boolean {

        if (this.navigatingBack) {
            this.navigatingBack = false;
            history.pushState(null, document.title, location.href);
            return false;
        }
        return true;

    }
}
