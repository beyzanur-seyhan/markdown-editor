interface textInformation {
  index: number;
  text: string;
  children?: textInformationChild[];
}

interface textInformationChild {
  index?: string;
  text: string;
  elementTag: string;
  children?: textInformationChild[];
}

let targetHTMLElement: HTMLElement;
let selectedText: string;
let textRange: Range;
let childIndexCounter = 0;
let indexCounter = 0;
let selectedChildObj: textInformationChild | undefined;
let childIndex = 0;
let textInformationList: textInformation[] = [];
let textInformation: textInformation | textInformationChild;
let editorHTMLElements: NodeList;
let textStartIndex: number;
let textEndIndex: number;
const divEditor = document.querySelector("#divEditor")! as HTMLDivElement;

divEditor.addEventListener("mouseup", (event: Event) => {
  targetHTMLElement = event.target as HTMLElement;
  selectedChildObj = findEqualChildren(targetHTMLElement.id);

  console.log(selectedChildObj);

  document.addEventListener("selectionchange", () => {
    textRange = window.getSelection()?.getRangeAt(0)!;
    textStartIndex = textRange.startOffset;
    textEndIndex = textRange.endOffset;
    selectedText = window.getSelection()?.toString()!;
  });
});

const findEqualChildren = (childIndex: string): textInformationChild => {
  return textInformation?.children?.find((child) => child.index == childIndex);
};

divEditor.addEventListener("mousedown", () => {
  for (let index = 0, len = divEditor.childNodes.length; index < len; index++) {
    (divEditor.childNodes[index] as HTMLElement).onclick = function () {
      childIndex = index;
    };
  }
});

const splitTextToSubstr = (tag: string): textInformationChild[] => {
  let str = "";
  let counter = 0;
  let textChildrenList: textInformationChild[] = [];

  for (let i = 0; i < textInformation.text.length; i++) {
    str += textInformation.text[i];
    textChildrenList[counter] = {
      text: str,
      elementTag: str == selectedText ? tag : "span",
    };

    if (!isSplitText(i)) continue;
    str = "";
    counter++;
  }
  return textChildrenList;
};

const createChildIndex = () => {
  textInformation.children?.forEach((child) => {
    child.index = `child_${childIndexCounter}`;
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

const createTextChildList = (tag: string) => {
  textInformation = selectedChildObj
    ? selectedChildObj
    : textInformationList[childIndex];
  textInformation.children = splitTextToSubstr(tag);
};

const addTagToText = () => {
  console.log(textInformationList, editorHTMLElements);
  let childElement = "";

  textInformation.children?.forEach((children) => {
    let childTag = children.elementTag;
    childElement += `<${childTag} id="${children.index}">${children.text}</${childTag}>`;

    targetHTMLElement.innerHTML =
      targetHTMLElement.id != "divEditor"
        ? childElement
        : `<div id="${indexCounter}">${childElement}</div>`;
  });
};

const getCurrentText = (index: number = indexCounter) => {
  let currentHTMLText: string;
  let currentHTMLNode = editorHTMLElements[index] as unknown as HTMLElement;

  if (currentHTMLNode?.textContent) {
    currentHTMLText = currentHTMLNode?.textContent!;
  } else {
    currentHTMLText = currentHTMLNode?.innerText!;
  }
  return currentHTMLText;
};

const createTextInformation = (): { index: number; text: string } => {
  let currentHTMLText = getCurrentText();
  return {
    index: indexCounter,
    text: currentHTMLText,
  };
};

document.addEventListener("keyup", (event: KeyboardEvent) => {
  editorHTMLElements = divEditor.childNodes! as NodeList;

  if (!editorHTMLElements) return;
  if (event.key == "Enter") {
    indexCounter = editorHTMLElements.length - 1;
    let editorHTMLElement = editorHTMLElements[
      indexCounter
    ] as unknown as HTMLElement;
    editorHTMLElement.innerHTML = `<br />`;
    editorHTMLElement.id = indexCounter.toString();
  }
  if (findChangedElIndex() > -1) indexCounter = findChangedElIndex();
  textInformationList[indexCounter] = createTextInformation();
});

const findChangedElIndex = () => {
  return [...editorHTMLElements].findIndex(
    (_element, index) =>
      getCurrentText(index) != textInformationList[index]?.text
  );
};
