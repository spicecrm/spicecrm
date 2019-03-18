/**
 * @module WorkbenchModule
 */
import {
    Component,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
@Component({
    templateUrl: './src/workbench/templates/componentconfigmanager.html'
})
export class ComponentConfigManager {

    sysModules: Array<any> = [];
    sysRoles: any = {};
    currentModule: string = '*';
    currentComponent: string = '';
    selectedId: string = '';
    selectedComponent: any = {};

    showAddDialog: boolean = false;
    showEditDialog: boolean = false;

    componentTree: Array<any> = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
    ) {
        // get roles
        this.backend.getRequest('configurator/entries/sysuiroles').subscribe(roles => {
            this.sysRoles['*'] = '*';
            for (let role of roles)
                this.sysRoles[role.id] = role.name;
        });

        this.backend.getRequest('spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;

            // iniutialize the metadata service
            // this.metadata.loadFieldSets(new Subject<any>());
            // this.metadata.loadComponents(new Subject<any>());
        });

    }

    reset() {
        this.currentComponent = '';
        this.componentTree = [];
        this.selectedComponent = {};
    }

    getComponents() {
        let configurations = this.metadata.getComponentConfigurations(this.currentModule);
        let components = []; let foundcomponents = [];
        for (let component in configurations) {
            for (let role in configurations[component]) {
                components.push({
                    id: component + '::' + role,
                    display: component + '/' + this.currentModule + '/' + this.sysRoles[role]
                });
                foundcomponents.push(component);
            }
        }

        if(this.currentModule !== '*') {
            configurations = this.metadata.getComponentConfigurations('*');
            for (let component in configurations) {
                for (let role in configurations[component]) {
                    if(foundcomponents.indexOf(component) === -1) {
                        components.push({
                            id: component + '::' + role,
                            display: component +'/*' + '/' + this.sysRoles[role]
                        });
                    }
                }
            }
        }

        components.sort((a, b) => {
            return a.display > b.display ? 1 : -1;
        });
        return components;
    }

    getRoles() {
        let roles = [];

        for (let roleid in this.sysRoles)
            roles.push({id: roleid, name: this.sysRoles[roleid]});

        return roles;
    }

    getComponentSetItems() {
        return [];
        // return this.currentComponent ? this.metadata.getComponentSetObjects(this.currentComponent) : [];
    }

    buildTree() {
        this.componentTree = [];


        if (!this.currentComponent) return;

        let config = this.currentComponent.split('::');

        let rootConfig = this.metadata.getComponentConfig(config[0], this.currentModule, config[1]);
        let rootComponent = {
            id: 'root',
            component: config[0],
            role: config[1],
            componentconfig: rootConfig,
            level: 1
        };

        this.componentTree.push(rootComponent);

        // select the root component
        this.selectedComponent = rootComponent;

        // see if we have componentsets to add to the Tree
        let options = this.metadata.getComponentConfigOptions(config[0]);
        if (rootConfig)
            this.parseOptions(options, rootConfig, 1);
    }

    parseOptions(options, componentconfig, level) {
        for (let option in options) {
            if (Array.isArray(options[option])) {
                for (let index in componentconfig[option]) {
                    this.parseOptions(options[option][0], componentconfig[option][index], level);
                }
            } else {
                if (options[option].type && options[option].type == 'componentset' && componentconfig[option]) {
                    this.addComponentSetToTree(option, componentconfig[option], level);
                }
            }
        }
    }

    addComponentSetToTree(name, componentSet, level) {

        level++;
        this.componentTree.push({
            component: name,
            level: level
        });
        level++;

        let config = this.currentComponent.split('::');

        let components = this.metadata.getComponentSetObjects(componentSet);
        for (let component of components) {
            if (JSON.stringify(component.componentconfig) === '{}') {
                component.componentconfig = this.metadata.getComponentConfig(component.component, this.currentModule, config[1]);
            }

            this.componentTree.push({
                id: component.id,
                component: component.component,
                role: config[1],
                componentconfig: component.componentconfig,
                level: level
            });

            let options = this.metadata.getComponentConfigOptions(component.component);

            if (component.componentconfig)
                this.parseOptions(options, component.componentconfig, level);

        }
    }

    selectComponent(component) {
        if (component.id) {
            console.log("componentt", component);
            this.selectedComponent = component;
        }else {
            this.selectedComponent = {};
        }
    }

    isSelected(id) {
        return id ? id === this.selectedComponent.id : false;
    }
}