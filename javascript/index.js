let currentHTMLElement;
let editorHTMLElements;
let selectedHtmlElement;
let textStartIndex;
let textEndIndex;
let targetHTMLElementId;
let selectedText;
let textRange;
let childIndexCounter = 0;
let indexCounter = 0;
let childIndex = 0;
const divEditor = document.querySelector("#divEditor");
const getSelectedElement = () => {
    let htmlElement;
    let childNode = currentHTMLElement.childNodes;
    if (childNode.length == 1 && childNode[0].nodeName == "#text") {
        htmlElement = editorHTMLElements[targetHTMLElementId];
    }
    else {
        htmlElement = document.getElementById(targetHTMLElementId);
    }
    return htmlElement;
};
divEditor.addEventListener("click", (event) => {
    if (!editorHTMLElements)
        return;
    currentHTMLElement = editorHTMLElements[childIndex];
    targetHTMLElementId = event.target.id;
    selectedHtmlElement = getSelectedElement();
});
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
const createIdForChild = () => {
    var _a;
    (_a = selectedHtmlElement.childNodes) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
        child.id = `child_${childIndexCounter}`;
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
const splitTextToSubArray = (tag) => {
    let str = "";
    let counter = 0;
    const childNode = [];
    const htmlText = selectedHtmlElement.innerText;
    selectedHtmlElement.innerHTML = "";
    for (let i = 0; i < htmlText.length; i++) {
        str += htmlText[i];
        let elementTag = str == selectedText ? tag : "span";
        let createdHtmlElement = document.createElement(elementTag);
        createdHtmlElement.innerHTML = str;
        childNode[counter] = createdHtmlElement;
        if (!isSplitText(i))
            continue;
        str = "";
        counter++;
    }
    return childNode;
};
const addTagToHtmlText = (tag) => {
    selectedHtmlElement.append(...splitTextToSubArray(tag));
};
document.addEventListener("keyup", (event) => {
    editorHTMLElements = divEditor.childNodes;
    if (!editorHTMLElements)
        return;
    if (event.key == "Enter") {
        indexCounter = editorHTMLElements.length - 1;
        const editorHTMLElement = editorHTMLElements[indexCounter];
        editorHTMLElement.innerHTML = `<br />`;
        editorHTMLElement.id = indexCounter.toString();
    }
});
divEditor.addEventListener("focus", () => {
    if (divEditor.innerHTML.trim() == "") {
        const div = document.createElement("div");
        div.id = "0";
        div.innerHTML = "<br />";
        divEditor.append(div);
    }
});
//# sourceMappingURL=index.js.map