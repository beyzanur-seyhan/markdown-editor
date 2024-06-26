let currentHTMLElement;
let editorHTMLElements;
let selectedHtmlElement;
let githubEmojis = [];
let textStartIndex;
let textEndIndex;
let targetHTMLElementId;
let selectedText;
let textRange;
let childIndexCounter = 0;
let indexCounter = 0;
let childIndex = 0;
const divEditor = document.querySelector("#divEditor");
const githubEmojiKey = "24e2c24d34bdff2c64ee138e9a3adafd9af71b08";
const githubEmojiApi = `https://emoji-api.com/emojis?access_key=${githubEmojiKey}`;
fetch(githubEmojiApi)
    .then((response) => response.json())
    .then((githubEmoji) => loadGihubEmoji(githubEmoji));
const loadGihubEmoji = (emojis) => {
    emojis === null || emojis === void 0 ? void 0 : emojis.forEach((emoji, index) => {
        if (emoji.character == "🫂")
            console.log(index);
        const li = document.createElement("li");
        li.innerHTML = emoji.character;
        document.getElementById("emojis").appendChild(li);
    });
};
divEditor.addEventListener("mouseup", () => {
    document.addEventListener("selectionchange", () => {
        let selection = window.getSelection();
        selectedHtmlElement = selection.focusNode.parentElement;
        textRange = selection.getRangeAt(0);
        textStartIndex = textRange.startOffset;
        textEndIndex = textRange.endOffset;
        selectedText = selection.toString();
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
const createHtmlElement = (text, tag) => {
    const elementTag = text == selectedText ? tag : "span";
    const createdHtmlElement = document.createElement(elementTag);
    createdHtmlElement.innerHTML = text;
    return createdHtmlElement;
};
const splitTextToSubArray = (tag) => {
    let str = "";
    let counter = 0;
    const childNode = [];
    const htmlText = selectedHtmlElement.innerText;
    selectedHtmlElement.innerHTML = "";
    for (let i = 0; i < htmlText.length; i++) {
        str += htmlText[i];
        childNode[counter] = createHtmlElement(str, tag);
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