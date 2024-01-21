"use strict";
let textInformations = [];
let indexCounter = 0;
let textStartIndex;
let textEndIndex;
const divEditor = document.querySelector("#divEditor");
divEditor.addEventListener("mouseup", () => {
    document.addEventListener("selectionchange", () => {
        var _a;
        const textRange = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.getRangeAt(0);
        textStartIndex = textRange.startOffset;
        textEndIndex = textRange.endOffset;
    });
});
const addTagToText = (tag) => {
    var _a, _b, _c, _d, _e;
    const text = (_c = (_b = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.textContent;
    ((_e = (_d = window.getSelection()) === null || _d === void 0 ? void 0 : _d.anchorNode) === null || _e === void 0 ? void 0 : _e.parentElement).innerHTML =
        (text === null || text === void 0 ? void 0 : text.slice(0, textStartIndex)) +
            `<${tag}>` +
            (text === null || text === void 0 ? void 0 : text.slice(textStartIndex, textEndIndex)) +
            `</${tag}>` +
            (text === null || text === void 0 ? void 0 : text.slice(textEndIndex, text.length));
};
const createTextInformation = (editorHTMLElements) => {
    let currentHTMLNode = editorHTMLElements[indexCounter];
    let currentHTMLText = editorHTMLElements.length == 1 ?
        currentHTMLNode === null || currentHTMLNode === void 0 ? void 0 : currentHTMLNode.textContent : currentHTMLNode === null || currentHTMLNode === void 0 ? void 0 : currentHTMLNode.innerText;
    return {
        index: indexCounter,
        text: currentHTMLText,
    };
};
document.addEventListener("keydown", (event) => {
    let editorHTMLElements = divEditor.childNodes;
    if (!editorHTMLElements)
        return;
    if (event.key == "Enter") {
        indexCounter = !editorHTMLElements.length ?
            0 : editorHTMLElements.length - 1;
    }
    textInformations[indexCounter] = createTextInformation(editorHTMLElements);
});
