interface githubEmojiItem {
  character: string;
  codePoint: string;
  group: string;
  slug: string;
  subGroup: string;
  unicodeName: string;
}

let currentHTMLElement: Node;
let editorHTMLElements: NodeList;
let selectedHtmlElement: HTMLElement;

let githubEmojis = [];

let textStartIndex: number;
let textEndIndex: number;

let targetHTMLElementId: string;
let selectedText: string;
let textRange: Range;

let childIndexCounter = 0;
let indexCounter = 0;
let childIndex = 0;

const divEditor = document.querySelector("#divEditor")! as HTMLDivElement;
const githubEmojiKey = "24e2c24d34bdff2c64ee138e9a3adafd9af71b08";
const githubEmojiApi = `https://emoji-api.com/emojis?access_key=${githubEmojiKey}`;

fetch(githubEmojiApi)
  .then((response) => response.json())
  .then((githubEmoji) => loadGihubEmoji(githubEmoji));

const loadGihubEmoji = (emojis: githubEmojiItem[]) => {
  emojis?.forEach((emoji, index) => {
    if (emoji.character == "🫂") console.log(index);
    const li = document.createElement("li");
    li.innerHTML = emoji.character;
    document.getElementById("emojis").appendChild(li);
  });
};

divEditor.addEventListener("mouseup", () => {
  document.addEventListener("selectionchange", () => {
    let selection = window.getSelection()!;

    selectedHtmlElement = selection.focusNode.parentElement;
    textRange = selection.getRangeAt(0)!;
    textStartIndex = textRange.startOffset;
    textEndIndex = textRange.endOffset;
    selectedText = selection.toString()!;
  });
});

divEditor.addEventListener("mousedown", () => {
  for (let index = 0, len = divEditor.childNodes.length; index < len; index++) {
    (divEditor.childNodes[index] as HTMLElement).onclick = function () {
      childIndex = index;
    };
  }
});

const createIdForChild = () => {
  selectedHtmlElement.childNodes?.forEach((child: HTMLElement) => {
    child.id = `child_${childIndexCounter}`;
    childIndexCounter = childIndexCounter + 1;
  });
};

const isSplitText = (textIndex: number): boolean => {
  let result = false;
  if (
    textIndex == textEndIndex - 1 ||
    textIndex == textStartIndex - 1 ||
    textStartIndex == textEndIndex
  ) {
    result = true;
  }
  return result;
};

const createHtmlElement = (text: string, tag: string) => {
  const elementTag = text == selectedText ? tag : "span";
  const createdHtmlElement = document.createElement(elementTag);
  createdHtmlElement.innerHTML = text;

  return createdHtmlElement;
};

const splitTextToSubArray = (tag: string): Node[] => {
  let str = "";
  let counter = 0;
  const childNode: Node[] = [];
  const htmlText = selectedHtmlElement.innerText;

  selectedHtmlElement.innerHTML = "";

  for (let i = 0; i < htmlText.length; i++) {
    str += htmlText[i];
    childNode[counter] = createHtmlElement(str, tag);

    if (!isSplitText(i)) continue;
    str = "";
    counter++;
  }
  return childNode;
};

const addTagToHtmlText = (tag: string): void => {
  selectedHtmlElement.append(...splitTextToSubArray(tag));
};

document.addEventListener("keyup", (event: KeyboardEvent) => {
  editorHTMLElements = divEditor.childNodes! as NodeList;

  if (!editorHTMLElements) return;

  if (event.key == "Enter") {
    indexCounter = editorHTMLElements.length - 1;
    const editorHTMLElement = editorHTMLElements[
      indexCounter
    ] as unknown as HTMLElement;
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
