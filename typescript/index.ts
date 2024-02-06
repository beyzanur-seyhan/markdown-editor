let currentHTMLElement: Node;
let editorHTMLElements: NodeList;
let selectedHtmlElement: HTMLElement;

let textStartIndex: number;
let textEndIndex: number;

let targetHTMLElementId: string;
let selectedText: string;
let textRange: Range;

let childIndexCounter = 0;
let indexCounter = 0;
let childIndex = 0;

const divEditor = document.querySelector("#divEditor")! as HTMLDivElement;

const getSelectedElement = () => {
  let htmlElement: HTMLElement;
  let childNode = currentHTMLElement.childNodes;

  if (childNode.length == 1 && childNode[0].nodeName == "#text") {
    htmlElement = editorHTMLElements[targetHTMLElementId];
  } else {
    htmlElement = document.getElementById(targetHTMLElementId);
  }
  return htmlElement;
};

divEditor.addEventListener("click", (event: Event) => {
  if (!editorHTMLElements) return;
  currentHTMLElement = editorHTMLElements[childIndex];

  targetHTMLElementId = (event.target as HTMLElement).id;
  selectedHtmlElement = getSelectedElement();
});

divEditor.addEventListener("mouseup", (event: Event) => {
  document.addEventListener("selectionchange", () => {
    textRange = window.getSelection()?.getRangeAt(0)!;
    textStartIndex = textRange.startOffset;
    textEndIndex = textRange.endOffset;
    selectedText = window.getSelection()?.toString()!;
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

const splitTextToSubArray = (tag: string): Node[] => {
  let str = "";
  let counter = 0;
  const childNode: Node[] = [];
  const htmlText = selectedHtmlElement.innerText;

  selectedHtmlElement.innerHTML = "";

  for (let i = 0; i < htmlText.length; i++) {
    str += htmlText[i];
    let elementTag = str == selectedText ? tag : "span";
    let createdHtmlElement = document.createElement(elementTag);

    createdHtmlElement.innerHTML = str;
    childNode[counter] = createdHtmlElement;

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
