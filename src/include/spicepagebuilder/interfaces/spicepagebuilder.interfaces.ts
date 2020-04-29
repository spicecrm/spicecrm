/**
 * container element to be rendered in the view
 */
export interface ContainerElementI {
    tagName: string;
    attributes: any;
    children: any[];
}
/**
 * body element that will be rendered in the view
 */
export interface BodyI extends ContainerElementI {
    attributes: {
        'background-color': string,
        'width': string
    };
}
/**
 * container element that will be rendered in the view
 */
export interface ContainerI extends ContainerElementI {
    attributes: {
        'background-color': string
    };
}
/**
 * section element to be rendered in the view
 */
export interface SectionI extends ContainerElementI {
    attributes: {
        'background-color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'padding'?: string,
        'text-align'?: string
    };
}
/**
 * column element to be rendered in the view
 */
export interface ColumnI extends ContainerElementI {
    attributes: {
        'background-color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'width'?: string,
        'vertical-align'?: string,
        'padding'?: string,
    };
}
/**
 * content element to be rendered in the view
 */
export interface ContentElementI {
    tagName: string;
    attributes: any;
}
/**
 * divider element to be rendered in the view
 */
export interface DividerI extends ContentElementI {
    attributes: {
        'border-top-color'?: string,
        'border-top-style'?: string,
        'border-top-width'?: string,
        'padding-top'?: string,
        'margin-top'?: string,
        'width'?: string
    };
}
/**
 * button element to be rendered in the view
 */
export interface ButtonI extends ContentElementI {
    content: string;
    attributes: {
        'href': string,
        'background-color'?: string,
        'color'?: string,
        'border-color'?: string,
        'border-style'?: string,
        'border-width'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'text-align'?: string,
        'vertical-align'?: string,
        'width'?: string
    };
}
/**
 * image element to be rendered in the view
 */
export interface ImageI extends ContentElementI {
    attributes: {
        'href?': string,
        'alt'?: string,
        'src': string,
        'title'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'width'?: string
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface SpacerI extends ContentElementI {
    attributes: {
        'background-color'?: string,
        'height': string,
        'width'?: string
    };
}
/**
 * text element to be rendered in the view
 */
export interface TextI extends ContentElementI {
    content: string;
    attributes: {
        'color'?: string,
        'background-color'?: string,
        'font-family'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'line-height'?: string,
        'letter-spacing'?: string,
        'height'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'align'?: string,
        'padding'?: string,
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface HTMLCodeI extends ContentElementI {
    content: string;
}
/**
 * available panel element
 */
export interface PanelElementI extends ContentElementI {
    icon: string;
    label: string;
    content?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface EditorAttributeI {
    name: string;
    type: string;
    label?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface AttributeObjectI {
    name: string;
    type: 'color'|'text'|'sides'|'';
}











































































