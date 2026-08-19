import {ComponentRef} from "@angular/core";

/**
 * holds an interface for object checklists component checklist item
 */
export interface ChecklistItemI {
    id: string;
    isCompleted: boolean;
    text: string;
    textBackup?: string;
    isChanged?: boolean;
}/**
 * holds an interface for object checklists component checklist
 */
export interface ChecklistI {
    id: string;
    name: string;
    items: ChecklistItemI[];
    showCompleted: boolean;
    showAddButton?: boolean;
}

/**
 * To be implemented when creating a new action set item button component
 */
export interface ActionSetItemI {
    /**
     * public method will be called from the ObjectActionContainerItem component,
     * when the action set item container (parent element) is clicked
     **/
    execute(): void;
    /**
     * public property contains the action set item config
     * will be set in AfterViewInit Hook in the ObjectActionContainerItem component
     */
    actionconfig?: any;
    /**
     * public property to be set in the button component that implements the interface
     * ObjectActionContainerItem will propagate the flag to the parent to implement
     * the disabled property on the button html element
     */
    disabled?: boolean;
    /**
     * public property to be set in the button component that implements the interface
     * ObjectActionContainerItem will propagate the flag to the parent to set the slds-hide
     * class on the button html element
     */
    hidden?: boolean;
    /**
     * public property holds a reference of the modal component which implements this interface
     * will be set by metadata.service.addComponentDirect when rendering the component dynamically
     */
    self?: ComponentRef<unknown>;
}

/**
 * To be implemented when creating a modal component
 */
export interface ModalComponentI {
    /**
     * public property holds a reference of the modal component which implements this interface
     * will be set by metadata.service.addComponentDirect when rendering the component dynamically
     */
    self: ComponentRef<unknown>;
}

/**
 * To be implemented when creating a component set item
 */
export interface ComponentSetItemI {
    /**
     * public property contains the component set item config
     * will be set by the SystemComponentSet component
     */
    componentconfig: any;
    /**
     * public property holds a reference of the modal component which implements this interface
     * will be set by metadata.service.addComponentDirect when rendering the component dynamically
     */
    self?: ComponentRef<unknown>;
}

export interface ObjectListFilterI {
    logicaloperator: string,
    groupscope: 'all' | 'own' | 'creator',
    groupstate?: 'active' | 'inactive' | 'activeAndInactive',
    conditions: Array<any>,
    geography?: Object,
    field?: string,
    operator?: string,
    filtervalue?: string
}

export interface ObjectActionMenuItemI {
    disabled: boolean,
    id: string,
    sequence: number,
    action: string,
    component: string | undefined,
    actionconfig: Object,
    singlebutton:  boolean,
    displayasicon?: boolean
}

/**
 * generic basic bean interface
 */
export interface SpiceBeanI {
    id: string;
    name?: string;
    summary_text?: string;
    deleted?: boolean;
    [key: string]: any
}

/**
 * possible states for a model field
 */
export type ModelFieldStateI = 'editable' | 'invalid' | 'required' | 'incomplete' | 'disabled' | 'hidden' | 'readonly';
/**
 * field states object
 */
export type ModelFieldStatesI  = {
    [State in ModelFieldStateI]: boolean
}

export interface ModuleFieldTranslationI {
    id?: string;
    translation_language: string;
    bean_module?: string;
    bean_id?: string;
    field_name?: string;
    translation_text: string;
}

export interface ModuleFieldTranslationsObjectI {
    [key: string]: ModuleFieldTranslationI;
}