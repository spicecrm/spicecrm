
export interface priceConditionElement {
    id: string;
    name?: string;
    label?: string;
    ext_id?: string;
    element_length?: string;
    element_domain?: string;
    element_module?: string;
    element_module_field?: string;
    element_transformation?: string;
    deleted?: boolean;
}

export interface priceDetermination {
    id: string;
    name?: string;
    label?: string;
    ext_id?: string;
    determinationattribute?: string;
    determinationmethod?: string;
    deleted?: boolean;
}

export interface priceDeterminationElement {
    id: string;
    pricedetermination_id: string;
    priceconditionelement_id: string;
    priceconditionelement_index: number;
    deleted?: boolean;
}

export interface priceConditionType {
    id: string;
    name?: string;
    label?: string;
    ext_id?: string;
    valuetype?: 'A'|'P'|'T'|'F';
    sortindex?: number;
    determinationtype: 'F'|'L'|'H';
    deleted?: boolean;
}

export interface priceConditionTypeDetermination {
    id: string;
    priceconditiontype_id: string;
    pricedetermination_id: string;
    pricedetermination_index: number;
    deleted?: boolean;
}

export interface priceCalculationSchema {
    id: string;
    name: string;
    deleted?: boolean;
}

export interface priceCalculationSchemaElement {
    id: string;
    syspricecalculationschema_id: string;
    elementindex: string;
    elementdeterminationtype?: 'C'|'M';
    elementname?: string;
    syspriceconditiontype_id?: string;
    elementtype?: string;
    elementbase?: string;
    elementbasetype?: 'A'|'I';
    elementcalculation?: string;
    editable: string;
    hidden: '0'|'1'|'2';
    print: '0'|'1'|'2';
    displaystyles?: string;
    deleted?: boolean;
}