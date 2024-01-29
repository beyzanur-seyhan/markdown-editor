let selectedText;
let textRange;
let childIndexCounter = 0;
let indexCounter = 0;
let childIndex = 0;
let textInformationList = [];
let textInformation;
let editorHTMLElements;
let textStartIndex;
let textEndIndex;
const divEditor = document.querySelector("#divEditor");
divEditor.addEventListener("mouseup", (event) => {
    document.addEventListener("selectionchange", () => {
        var _a, _b;
        textRange = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.getRangeAt(0);
        textStartIndex = textRange.startOffset;
        textEndIndex = textRange.endOffset;
        selectedText = (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString();
    });
});
divEditor.addEventListener("mousedown", () => {
    for (let index = 0, len = divEditor.childNodes.length; index < len; index++) {
        divEditor.childNodes[index].onclick = function () {
            childIndex = index;
        };
    }
});
const splitTextToSubstr = () => {
    let str = "";
    let counter = 0;
    let textChildrenList = [];
    for (let i = 0; i < textInformation.text.length; i++) {
        str += textInformation.text[i];
        textChildrenList[counter] = {
            childText: str,
            isSelectedText: str == selectedText ? true : false,
        };
        if (!isSplitText(i))
            continue;
        str = "";
        counter++;
    }
    return textChildrenList;
};
const createChildIndex = () => {
    var _a;
    (_a = textInformation.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
        child.index = `child_${childIndexCounter}`;
        childIndexCounter = childIndexCounter + 1;
    });
};
const isSplitText = (textIndex) => {
    let result = false;
    if (textIndex == textEndIndex - 1 ||
        textIndex == textStartIndex - 1 ||
        textStartIndex == textEndIndex) {
        result = true;
    }
    return result;
};
const createTextChildList = () => {
    textInformation = textInformationList[childIndex];
    textInformation.children = splitTextToSubstr();
};
const addTagToText = (tag) => {
    console.log(textInformationList, editorHTMLElements);
    let childElement;
    divEditor.innerHTML = "";
    textInformationList.forEach((textInfo, index) => {
        childElement =
            textInfo.children && createChildElement(textInfo.children, tag);
        divEditor.innerHTML += `<div id="${index}">${(childElement === null || childElement === void 0 ? void 0 : childElement.length) ? childElement : textInfo.text}</div>`;
    });
};
const createChildElement = (children, tag) => {
    let childElement = "";
    children === null || children === void 0 ? void 0 : children.forEach((child) => {
        let childTag = !child.isSelectedText ? "span" : tag;
        childElement += `<${childTag} id="${child.index}">${child.childText}</${childTag}>`;
    });
    return childElement;
};
const getCurrentText = (index = indexCounter) => {
    let currentHTMLText;
    let currentHTMLNode = editorHTMLElements[index];
    if (currentHTMLNode === null || currentHTMLNode === void 0 ? void 0 : currentHTMLNode.textContent) {
        currentHTMLText = currentHTMLNode === null || currentHTMLNode === void 0 ? void 0 : currentHTMLNode.textContent;
    }
    else {
        currentHTMLText = currentHTMLNode === null || currentHTMLNode === void 0 ? void 0 : currentHTMLNode.innerText;
    }
    return currentHTMLText;
};
const createTextInformation = () => {
    let currentHTMLText = getCurrentText();
    return {
        index: indexCounter,
        text: currentHTMLText,
    };
};
document.addEventListener("keyup", (event) => {
    editorHTMLElements = divEditor.childNodes;
    if (!editorHTMLElements)
        return;
    if (event.key == "Enter") {
        indexCounter = editorHTMLElements.length - 1;
        editorHTMLElements[indexCounter].innerHTML = `<br />`;
    }
    if (findChangedElIndex() > -1)
        indexCounter = findChangedElIndex();
    textInformationList[indexCounter] = createTextInformation();
});
const findChangedElIndex = () => {
    return [...editorHTMLElements].findIndex((_element, index) => { var _a; return getCurrentText(index) != ((_a = textInformationList[index]) === null || _a === void 0 ? void 0 : _a.text); });
};
//# sourceMappingURL=index.js.map