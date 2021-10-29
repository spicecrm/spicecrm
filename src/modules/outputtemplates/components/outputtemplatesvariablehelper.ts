/**
 * @module ModuleOutputTemplates
 */
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';
import { take } from 'rxjs/operators';
import { backend } from '../../../services/backend.service';
import { model } from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/outputtemplates/templates/outputtemplatesvariablehelper.html'
})
export class OutputTemplatesVariableHelper implements OnInit {

    /**
     * reference to the modal component
     */
    private self: any;

    /**
     * event emitter for the response
     */
    @Output() private response: EventEmitter<any> = new EventEmitter<any>();

    /**
     * The model of the template the whole thing belongs to (email template or output template or ...)
     */
    private templateModel: model;

    /**
     * The list of the 3 on top offered modules (bean, template, current user).
     */
    private offeredModules: any[] = [];

    /**
     * The active (selected) module off the on top offered modules.
     */
    private activeModule: string; // 'bean'|'current_user'|'template';

    /**
     * Holds all the fields of the modules.
     */
    private moduleFields: any[] = [];

    /**
     * List of all system template functions (pipe and non-pipe).
     */
    private allFunctions: any;

    /**
     * The System Template Functions offered for selection by user, either pipe or non-pipe.
     */
    private offeredFunctions: any;

    /**
     * Filter value to narrow down the offered fields the user is looking for.
     */
    private fieldFilter = '';

    /**
     * Are the fields of the just selected module currently loading?
     */
    private isLoadingModuleFields = false;

    /**
     * Are the system template functions currently loading?
     */
    private isLoadingFunctions = false;

    /**
     * The path of modules the system tree delivered.
     */
    private modulePathFromTree = '';

    /**
     * The result of the function selection.
     */
    private functionResult = '';

    /**
     * The result of the module field selection.
     */
    private fieldResult = '';

    /**
     * Holds the history of selected system template functions. So the user can do a step-by-step recovery.
     */
    private functionHistory: any[] = [];

    /**
     * Is there a template (EmailTemplate or OutputTemplate) in the base?
     */
    private hasTemplate = false;

    /**
     * The params of the actual (last selected) function.
     */
    private actualFunctionParams = [];

    constructor( public language: language, public metadata: metadata, private backend: backend, private cdr: ChangeDetectorRef, @Optional() private model: model ) { }

    public ngOnInit(): void {

        // Build the array of offered modules.
        this.offeredModules = [{
            name: 'Users',
            templateObjectName: 'current_user',
            displayName: this.language.getLabel('LBL_CURRENT_USER')
        }];
        if ( this.model?.module === 'CampaignTasks' ) {
            let done = {}; // Helper object to prevent collecting one module several times.
            if ( this.metadata.fieldDefs.ProspectLists ) {
                let plMetadata = this.metadata.fieldDefs.ProspectLists;
                Object.keys( plMetadata ).forEach( item => {
                    if ( plMetadata[item].type === 'link' ) {
                        let searchTerm = ( plMetadata[item].module ? plMetadata[item].module : plMetadata[item].name ).toLowerCase();
                        for( let key in this.metadata.fieldDefs ) {
                            if( key.toLowerCase() == searchTerm ) {
                                if ( !done[key] === true ) {
                                    this.offeredModules.push( {
                                        name: key,
                                        templateObjectName: 'bean.' + key,
                                        displayName: this.language.getLabel(this.metadata.getModuleDefs( key ).module_label)
                                    } );
                                    done[key]=true;
                                }
                            }
                        }
                    }
                });
            }
        }
        if ( this.model?.module === 'OutputTemplates' || this.model?.module === 'EmailTemplates' ) {
            this.hasTemplate = true;
            this.templateModel = this.model;
            this.offeredModules.push({
                name: this.templateModel.module,
                templateObjectName: 'template',
                displayName: this.language.getLabel('LBL_TEMPLATE')
            });
            if ( this.templateModel.getFieldValue('module_name')) {
                this.offeredModules.push({
                    name: this.templateModel.getFieldValue('module_name'),
                    templateObjectName: 'bean.'+this.templateModel.getFieldValue('module_name'),
                    displayName: this.language.getModuleName( this.templateModel.getFieldValue('module_name'), true )
                });
            }
        }
        this.language.sortObjects( this.offeredModules, 'displayName');
        // Load the system template functions from the backend.
        this.loadFunctions();
    }

    /**
     * Loads all system template functions from the backend.
     * Divides them into pipe and non-pipe functions.
     */
    private loadFunctions(): void {
        this.isLoadingFunctions = true;
        this.backend.getRequest('module/OutputTemplates/templateFunctions')
            .pipe(take(1))
            .subscribe(response => {
                this.allFunctions = response;
                this.language.sortObjects( this.allFunctions.pipe, 'name' );
                this.language.sortObjects( this.allFunctions.noPipe, 'name' );
                this.isLoadingFunctions = false;
                this.buildOfferedFunctions();
            });
    }

    /**
     * Either the pipe or the non-pipe functions have to be offered for selection,
     * depends on whether a field or function has already been selected or nothing.
     */
    private buildOfferedFunctions(): void {
        if ( this.fieldResult || this.functionResult ) this.offeredFunctions = this.allFunctions.pipe;
        else this.offeredFunctions = this.allFunctions.noPipe;
    }

    /**
     * Close the modal.
     */
    private close(): void {
        this.self.destroy();
    }

    /**
     * Cancel button clicked.
     */
    private cancel(): void {
        this.close();
    }

    /**
     * Escape or X from the modal.
     */
    private onModalEscX(): void {
        this.cancel();
    }

    /**
     * OK button clicked:
     * Submit (to the rich text editor) the field name (with its path) and the selected function names,
     * joined by a pipe symbol. At last close the modal.
     */
    private submit(): void {
        let back;
        if ( !this.fieldResult && !this.functionResultWithParams ) back = '';
        if ( !this.fieldResult && this.functionResultWithParams ) back = 'func.'+this.functionResultWithParams;
        else {
            back = this.fieldResult;
            if ( this.functionResultWithParams ) back += '|' + this.functionResultWithParams;
        }
        this.response.emit( back );
        this.close();
    }

    /**
     * Loads the fields for a given module.
     */
    private getModuleFields( forModule, rootModule ) {
        this.moduleFields[rootModule] = [];
        this.isLoadingModuleFields = true;
        this.cdr.detectChanges();
        this.backend.getRequest('dictionary/browser/' + forModule + '/fields')
            .pipe(take(1))
            .subscribe(items => {
                this.moduleFields[rootModule] = items.filter(item => item.type != 'relate' && item.source != 'non-db');
                this.isLoadingModuleFields = false;
            });
    }

    /**
     * Narrow down the fields according the filter value.
     */
    private getFilteredFields( fields ): [] {
        return !this.fieldFilter ? fields : fields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.fieldFilter.toLowerCase()) ||
                    (nodeFiled.label && this.language.getLabel(nodeFiled.label).toLowerCase().includes(this.fieldFilter.toLowerCase()));
            });
    }

    /**
     * Track changes for items in the iterable.
     */
    private trackByFn(index, item) {
        return index;
    }

    /**
     * One of the 3 module tabs has beed clicked.
     */
    private setActiveModuleTab( templateObjectName ): void {
        this.activeModule = templateObjectName;
    }

    /**
     * An item of the module tree has been selected.
     */
    private treeItemSelected( data, rootModule ): void {
        this.modulePathFromTree = data.path;
        this.getModuleFields(data.module, rootModule);
    }

    /**
     * Undoes the last selection of a system template function.
     */
    private functionUndo(): void {
        if ( this.functionHistory.length ) {
            let popped = this.functionHistory.pop();
            this.functionResult = popped.result;
            this.actualFunctionParams = popped.params;
            this.buildOfferedFunctions();
        }
    }

    /**
     * Getter for the function result string incl. the parameters (seperated by ':').
     */
    private get functionResultWithParams() {
        let result = this.functionResult;
        this.actualFunctionParams.forEach( item => {
            result += ':';
            if ( item.value !== undefined && item.value !== '' ) result += ( item.type === 'string' ? '"'+item.value+'"' : item.value );
            result = result.replace(/:+$/g, '');
        });
        return result;
    }

    /**
     * Fills the field with the function result.
     * And updates the offered functions (because now the pipe functions have to be displayed).
     */
    private functionSelected( func ): void {
        this.functionHistory.push({
            result: this.functionResult,
            params: this.actualFunctionParams
        });
        this.functionResult = this.functionResultWithParams;
        if ( this.functionResult ) this.functionResult += '|';
        this.functionResult += func.name;
        this.actualFunctionParams = func.paramConfigs ? JSON.parse(JSON.stringify(func.paramConfigs)) : [];
        this.buildOfferedFunctions();
    }

    /**
     * Fills the field with the field result.
     * And updates the offered functions (because now the pipe functions have to be displayed).
     */
    private fieldSelected( field: string ): void {
        let parts = this.modulePathFromTree.split(/::/);
        let simplePath = []; // The elements for the path with the syntax the template compiler needs.
        for ( let i = 1; i < parts.length; i++ ) {
            simplePath.push( parts[i].split(':').pop() );
        }
        let joined = simplePath.join('.'); // The path with the syntax the template compiler needs.
        if ( joined ) joined += '.';
        if ( this.activeModule.indexOf('bean.',0) !== -1 ) {
            this.fieldResult = 'bean.'+joined+field;
        } else {
            switch( this.activeModule ) {
                case 'current_user':
                    this.fieldResult = 'current_user.' + joined + field;
                    break;
                case 'template':
                    this.fieldResult = 'template.' + joined + field;
                    break;
            }
        }
        this.buildOfferedFunctions();
    }

    /**
     * Clears the field with the field result.
     * And updates the offered functions (because now the non-pipe functions have to be displayed).
     */
    private clearFieldResult() {
        this.fieldResult = '';
        this.buildOfferedFunctions();
    }

}
