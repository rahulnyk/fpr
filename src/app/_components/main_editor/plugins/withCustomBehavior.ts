import { Editor, Transforms, Range } from "slate";
import { Element } from "slate";
import {
    CustomBaseElement,
    CustomText,
    HeadingElement,
    HeadingTypes,
    Headings,
    editorModes,
} from "../types";

export const withCustomBehavior = (editor: Editor) => {
    /**
     * Is the current editor selection a range, that is the focus and the anchor are different?
     *
     * @returns {boolean} true if the current selection is a range.
     */
    editor.isSelectionExpanded = (): boolean => {
        return editor.selection ? Range.isExpanded(editor.selection) : false;
    };

    /**
     * Returns true if current selection is collapsed, that is there is no selection at all
     * (the focus and the anchor are the same).
     *
     * @returns {boolean} true if the selection is collapsed
     */
    editor.isSelectionCollapsed = (): boolean => {
        return !editor.isSelectionExpanded();
    };

    /**
     * Returns the first node at the current selection
     */
    editor.getCurrentNode = () => {
        if (editor.selection) {
            const [node, path] = Editor.node(editor, editor.selection);
            return node;
        }
    };

    editor.getCurrentNodePath = () => {
        const [, path] = Editor.parent(editor, editor.selection || [0]);
        return path;
    };

    editor.isCollapsed = () => {
        const { selection } = editor;
        return !!(selection && Range.isCollapsed(selection));
    };

    editor.getCurrentElement = () => {
        try {
            const [node] = Editor.parent(editor, editor.selection || [0]);
            if (Element.isElement(node)) {
                return node;
            }
        } catch (e) {
            console.log(e);
        }
    };

    editor.getCurrentElementText = () => {
        const element = editor.getCurrentElement();
        if (element && element.children.length) {
            let text = element.children
                .map((child) => (child as CustomText).text)
                .join("");
            return text;
        }
        return "";
    };

    editor.getCurrentElementType = () => {
        const [entry] = Editor.nodes(editor, {
            match: (n) => Element.isElement(n),
        });
        const [element] = entry;
        return (element as Element).type;
    };

    editor.isCurrentNodeHeadding = () => {
        const [entry] = Editor.nodes(editor, {
            match: (n) => Element.isElement(n),
        });
        const [element] = entry;
        return Headings.includes((element as HeadingElement).type);
    };

    editor.getSelectedText = (anchorOffset = 0, focusOffset?: any): string => {
        const { selection } = editor;

        if (selection) return Editor.string(editor, selection);

        return "";
    };

    return editor;
};

// Use CustomBehaviorEditor in your application
