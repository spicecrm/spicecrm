/**
 * @module services
 */
import {Subject, Observable, of} from "rxjs";
import {
    Injectable,
    ComponentFactoryResolver,
    NgModuleFactoryLoader,
    Compiler, EventEmitter, Injector
} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {session} from "./session.service";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {Router, Route, CanActivate} from "@angular/router";

// for the dynamic routes
// import {loginCheck} from "../services/login.service";


declare var System: any;
declare var SystemJS: any;
declare var SystemDynamicRouteContainer: any;
declare var _;

@Injectable()
export class metadata {
    // modules: Array<any> = [];
    /**
     * hols the module defs returned from teh backend. This has all teh necesary info on the module itself
     */
    private componentFactories: any = {};
    private role: string = "";

    constructor(
        private NgModuleFactoryLoader: NgModuleFactoryLoader,
        private http: HttpClient,
        private session: session,
        private configuration: configurationService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private broadcast: broadcast,
        private compiler: Compiler,
        private Injector: Injector
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

    get moduleDirectory() {
        return this.configuration.getData('modules');
    }

    get componentDirectory() {
        return this.configuration.getData('components');
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
     * message handler for workbench updates
     */
    private handleMessage(message) {
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

    private addRoute(path: string, component: string) {
        let module = this.componentDirectory[component].module;

        System.import(this.moduleDirectory[module].path)
            .then((fileContents: any) => {
                return fileContents[this.moduleDirectory[module].module];
            })
            .then((type: any) => {
                this.moduleDirectory[module].factories = {};
                this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                    componentfactory.componentFactories.some(factory => {
                        if (factory.componentType.name === component) {
                            this.router.config.push({
                                path: path,
                                component: factory.componentType,
                            });
                            return true;
                        }
                    });
                });
            });
    }

    /*
    * dynamically add routes from this.routes with a route container hat will handle the dynamic routes
     */
    public addRoutes() {
        System.import("app/systemcomponents/systemcomponents")
            .then((fileContents: any) => {
                return fileContents.SystemComponents;
            })
            .then((type: any) => {
                this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                    componentfactory.componentFactories.some(factory => {
                        if (factory.componentType.name === "SystemDynamicRouteContainer") {
                            for (let route of this.routes) {
                                this.router.config.unshift({
                                    path: route.path,
                                    component: factory.componentType,
                                });
                            }
                            return true;
                        }
                    });
                });
            });
    }

    /*
     * function to add Component
     */
    public addComponentDirect(component: string, viewChild: any, injector?: Injector): Observable<any> {
        let retSubject = new Subject();

        if (!this.componentDirectory[component]) {
            System.import("app/systemcomponents/systemcomponents")
                .then((fileContents: any) => {
                    return fileContents.SystemComponents;
                })
                .then((type: any) => {
                    this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                        componentfactory.componentFactories.some(factory => {
                            if (factory.componentType.name === "SystemComponentMissing") {
                                let componentRef = viewChild.createComponent(factory, undefined, injector);
                                componentRef.instance.component = component;
                                retSubject.next(componentRef);
                                retSubject.complete();
                                return true;
                            }
                        });
                    });
                });
        } else {
            if (this.componentDirectory[component].module) {
                let module = this.componentDirectory[component].module;

                try {
                    System.import(this.moduleDirectory[module].path)
                        .then((fileContents: any) => {
                            return fileContents[this.moduleDirectory[module].module];
                        })
                        .then((type: any) => {
                            this.moduleDirectory[module].factories = {};
                            this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                                let foundComp = componentfactory.componentFactories.some(factory => {
                                    if (factory.componentType.name === component) {
                                        let componentRef = viewChild.createComponent(factory, undefined, injector);
                                        componentRef.instance.self = componentRef;
                                        retSubject.next(componentRef);
                                        retSubject.complete();
                                        return true;
                                    }
                                });
                                if (!foundComp) {
                                    // console.error("Cannot find a factory for component " + component);
                                    retSubject.error("Cannot find a factory for component " + component);
                                    retSubject.complete();
                                }
                            });
                        });
                } catch (e) {
                    retSubject.error(e);
                    retSubject.complete();
                }
            } else {
                System.import(this.componentDirectory[component].path)
                    .then((fileContents: any) => {
                        return fileContents[component];
                    })
                    .then((componentcreated: any) => {
                        let factory = this.componentFactoryResolver.resolveComponentFactory(componentcreated);
                        let componentRef = viewChild.createComponent(factory, undefined, injector);
                        componentRef.instance.self = componentRef;
                        retSubject.next(componentRef);
                        retSubject.complete();
                    });
            }
        }
        return retSubject.asObservable();
    }

    public checkComponent(component: string) {

        if (this.componentDirectory[component]) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * add a Component dynamically, by placing a container element wrapper first and inside the component itself
     */
    public addComponent(component: string, viewChild: any, injector?: Injector): Observable<any> {
        let retSubject = new Subject();
        // if the component is missing...
        if (!this.componentDirectory[component]) {
            SystemJS.import("app/systemcomponents/systemcomponents")
                .then((fileContents: any) => {
                    return fileContents.SystemComponents;
                })
                .then((type: any) => {
                    this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                        componentfactory.componentFactories.some(factory => {
                            if (factory.componentType.name === "SystemComponentMissing") {
                                let componentRef = viewChild.createComponent(factory, undefined, injector);
                                componentRef.instance.component = component;
                                retSubject.next(componentRef);
                                retSubject.complete();
                                return true;
                            }
                        });
                    });
                });
        } else {
            // add SystemComponentContainer first
            SystemJS.import("app/systemcomponents/systemcomponents")
                .then((fileContents: any) => {
                    return fileContents.SystemComponents;
                })
                .then((type: any) => {
                    this.compiler.compileModuleAndAllComponentsAsync(type).then(componentfactory => {
                        let cmp_factory = componentfactory.componentFactories.find((e) => e.componentType.name === "SystemComponentContainer");
                        let componentRef = viewChild.createComponent(cmp_factory, undefined, injector);

                        // add the info ybout the component being added
                        componentRef.instance.containerComponent = component;

                        // add the component itself...
                        componentRef.instance.containerRef.subscribe(subref => {
                            // load by module...
                            if (this.componentDirectory[component].module) {
                                let module = this.componentDirectory[component].module;

                                SystemJS.import(this.moduleDirectory[module].path)
                                    .then((fileContents: any) => {
                                        return fileContents[this.moduleDirectory[module].module];
                                    })
                                    .then((subtype: any) => {
                                        this.moduleDirectory[module].factories = {};
                                        this.compiler.compileModuleAndAllComponentsAsync(subtype).then(subComponentfactory => {
                                            cmp_factory = subComponentfactory.componentFactories.find((e) => e.componentType.name === component);
                                            if (!cmp_factory) {
                                                console.error("Cannot find a factory for component " + component);
                                                return false;
                                            }

                                            let selfComponentRef = subref.createComponent(cmp_factory);
                                            selfComponentRef.instance.self = componentRef;
                                            retSubject.next(selfComponentRef);
                                            retSubject.complete();
                                            componentRef.instance.loaded = true;
                                            return true;
                                        });
                                    });

                            } else {
                                // kinda deprecated... don"t use path anymore...
                                System.import(this.componentDirectory[component].path)
                                    .then((fileContents: any) => {
                                        return fileContents[component];
                                    })
                                    .then((componentcreated: any) => {
                                        let factory = this.componentFactoryResolver.resolveComponentFactory(componentcreated);
                                        let componentRef = viewChild.createComponent(factory, undefined, injector);
                                        componentRef.instance.self = componentRef;
                                        retSubject.next(componentRef);
                                        retSubject.complete();
                                    });
                            }
                        });
                        return true;
                    });
                });

        }
        return retSubject.asObservable();
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
            return a.name > b.name ? 1 : -1;
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

    public addComponentToComponentset(id, componentset, item) {
        this.componentSets[componentset].items.push({
            id: id,
            component: item,
            componentconfig: {},
            sequence: 0
        });

        let i = 0;
        for (let ocmponent of this.componentSets[componentset].items) {
            ocmponent.sequence = i;
            i++;
        }
    }

    /*
     * get the definitiopn for the related links
     */

    public getRawFieldSets() {
        return this.fieldSets;
    }

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
    }

    public addFieldset(id, module, name, type = "custom", items = []) {
        this.fieldSets[id] = {
            items: items,
            module: module,
            name: name,
            type: type
        };
    }

    public addFieldsetToFieldset(id, parent, itemid) {
        this.fieldSets[parent].items.push({
            id: id,
            fieldset: itemid,
            fieldconfig: {},
            sequence: 0
        });

        let i = 0;
        for (let item of this.fieldSets[parent].items) {
            item.sequence = i;
            i++;
        }
    }

    public addFieldToFieldset(id, parent, field) {
        this.fieldSets[parent].items.push({
            id: id,
            field: field,
            fieldconfig: {},
            sequence: 0
        });

        let i = 0;
        for (let item of this.fieldSets[parent].items) {
            item.sequence = i;
            i++;
        }
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
            return this.fieldDefs[module][field].vname;
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
        return this.moduleDefs[module];
    }

    /**
     * returns for a given modulename if the duplicate check is active for the module
     *
     * @param module the name of the module
     */
    public getModuleDuplicatecheck(module) {
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
     * returns the name of the icon to be used for the module
     *
     * @param module the name of the module
     */
    public getModuleIcon(module) {
        try {
            return this.moduleDefs[module].icon;
        } catch (e) {
            return false;
        }
    }

    public getModuleSingular(module) {
        try {
            return this.moduleDefs[module].singular;
        } catch (e) {
            return module;
        }
    }

    public getModuleFromSingular(singular) {
        let module = "";
        for (let thismodule in this.moduleDefs) {
            if (this.moduleDefs[thismodule].singular == singular) {
                module = thismodule;
            }
        }
        return module;
    }

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
    public getModuleFields(module: string) {
        try {
            return this.fieldDefs[module] ? this.fieldDefs[module] : [];
        } catch (e) {
            return [];
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

    public getModuleListTypes(module: string) {
        try {
            return this.moduleDefs[module].listtypes;
        } catch (e) {
            return [];
        }
    }

    public addModuleListType(module: string, listTypeData: any) {
        this.moduleDefs[module].listtypes.push(listTypeData);
    }

    public updateModuleListType(module: string, listTypeData: any) {
        this.moduleDefs[module].listtypes.some(listtype => {
            if (listtype.id == listTypeData.id) {
                for (let key in listTypeData) {
                    if (listTypeData.hasOwnProperty(key)) {
                        listtype[key] = listTypeData[key];
                    }
                }
                return true;
            }
        });
    }

    public getFieldDefs(module: string, field: string) {
        try {
            return this.fieldDefs[module][field];
        } catch (e) {
            return "varchar";
        }
    }

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

    /*
     * get the action set
     */
    public getActionSets(module = "") {
        let retActionSets: any[] = [];

        for (let actionset in this.actionSets) {
            if (module !== "" && (this.actionSets[actionset].module !== module && this.actionSets[actionset].module !== "*")) {
                continue;
            }

            retActionSets.push({
                id: actionset,
                name: this.actionSets[actionset].name,
                module: this.actionSets[actionset].module,
                type: this.actionSets[actionset].type
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
        if (!this.moduleFilters) this.configuration.setData('moduleFilters', {});
        this.moduleFilters[id] = {
            id,
            name,
            module,
            type
        };
    }

    /**
     * @param filterId: string
     */
    public removeModuleFilter(filterId) {
        delete this.moduleFilters[filterId];
    }

    /*
     get available Roles
     */
    public checkModuleAcl(module, action) {
        try {
            return this.moduleDefs[module].acl[action];
        } catch (e) {
            return false;
        }

    }

    public getRoles() {
        return this.roles;
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

    public setActiveRole(roleid) {
        this.role = roleid;
    }

    public getRoleModules(menu = false) {
        let modules = [];

        if (this.rolemodules[this.role]) {
            for (let rolemodule of this.rolemodules[this.role]) {
                if ((menu === false || rolemodule.sequence !== null) && this.moduleDefs[rolemodule.module] && this.moduleDefs[rolemodule.module].visible && this.moduleDefs[rolemodule.module].acl.list) {
                    modules.push(rolemodule.module);
                }
            }
        }

        return modules;
    }

    public getCopyRules(from, to) {
        return this.copyrules[from] && this.copyrules[from][to] ? this.copyrules[from][to] : [];
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

    /*
    * for the route handling
     */

    public getRouteComponent(route) {
        let component = "";
        this.routes.some(routeDetails => {
            if (routeDetails.path == route) {
                component = routeDetails.component;
                return true;
            } else if (route.split("/").length == routeDetails.path.split("/").length) {
                let routeArray = route.split("/");
                let matchArray = routeDetails.path.split("/");
                let matched = true;

                let i = 0;
                while (i < routeArray.length && matched) {
                    if (matchArray[i].substr(0, 1) !== ":" && matchArray[i] !== routeArray[i]) {
                        matched = false;
                    }
                    i++;
                }

                if (matched) {
                    component = routeDetails.component;
                    return true;
                }

            }
        });
        return component;
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
     * Lib Loading
     */

    public loadLibs(...scripts: string[]): Observable<object> {
        let observables: Array<Observable<object>> = [];
        scripts.forEach((script) => {
            observables.push(this.loadLib(script));
        });

        let sub = new Subject();
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

    /**
     * this function is used recursively to load scripts serially, one after the other
     * @param {string} name
     * @returns {Observable<object>}
     */
    private loadLib(name: string): Observable<object> {
        let sub = new Subject<object>();

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

    private loadScript(script) {
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

    private isLibLoading(name): boolean {
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

    public getHtmlStylesheetCode(stylesheetId: string): string {
        return _.isObject(this.htmlStyleData.stylesheets[stylesheetId]) && _.isString(this.htmlStyleData.stylesheets[stylesheetId].csscode) ? this.htmlStyleData.stylesheets[stylesheetId].csscode : "";
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

    private htmlStylesToObjects(stylesheetId) {
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

}


@Injectable()
export class aclCheck implements CanActivate {
    constructor(private metadata: metadata, private router: Router, private session: session) {
    }

    public canActivate(route, state) {
        if (route.params.module === 'Users' && !this.session.authData.admin) {
            return false;
        } // prevents non-admins from listing the user list
        // if ( route.params.module === 'Users' && this.session.authData.portalOnly ) return false; // prevents "portal only users" from listing the user list
        if (route.params.module && route.params.module != "Home" && !this.metadata.checkModuleAcl(route.params.module, "list")) {
            this.router.navigate(["/modules/Home"]);
            return false;
        } else {
            return true;
        }
    }
}
