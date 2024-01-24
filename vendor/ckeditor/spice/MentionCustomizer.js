export function MentionCustomization(editor) {
    // The upcast converter will convert view <a class="mention" href="" data-id="">
    // elements to the model 'mention' text attribute.
    editor.conversion.for('upcast').elementToAttribute({
        view: {
            name: 'a',
            key: 'data-id',
            classes: 'mention',
            attributes: {
                href: true,
                'data-id': true,
                'data-module': true
            }
        },
        model: {
            key: 'mention',
            value: viewItem => {
                // The mention feature expects that the mention attribute value
                // in the model is a plain object with a set of additional attributes.
                // In order to create a proper object use the toMentionAttribute() helper method:
                return editor.plugins.get('Mention').toMentionAttribute(viewItem, {
                    // Add any other properties that you need.
                    link: viewItem.getAttribute('href'),
                    id: viewItem.getAttribute('data-id'),
                    module: viewItem.getAttribute('data-module')
                });
            }
        },
        converterPriority: 'high'
    });
    // Downcast the model 'mention' text attribute to a view <a> element.
    editor.conversion.for('downcast').attributeToElement({
        model: 'mention',
        view: (modelAttributeValue, { writer }) => {
            // Do not convert empty attributes (lack of value means no mention).
            if (!modelAttributeValue) {
                return;
            }
            return writer.createAttributeElement('a', {
                class: 'mention',
                'data-id': modelAttributeValue.id,
                'data-module': modelAttributeValue.module,
                'href': modelAttributeValue.link
            }, {
                // Make mention attribute to be wrapped by other attribute elements.
                priority: 20,
                // Prevent merging mentions together.
                id: modelAttributeValue.uid
            });
        },
        converterPriority: 'high'
    });
}
//# sourceMappingURL=MentionCustomizer.js.map