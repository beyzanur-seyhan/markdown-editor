interface textInformation {
  index: number;
  text: string;
  children?: textInformationChild[];
}

interface textInformationChild {
  childText: string;
  isSelectedText: boolean;
}

let selectedText: string;
let textRange: Range;
let indexCounter = 0;
let childIndex = 0;
let textInformationList: textInformation[] = [];
let textInformation: textInformation;
let editorHTMLElements: any[];
let textStartIndex: number;
let textEndIndex: number;
const divEditor = document.querySelector("#divEditor")! as HTMLDivElement;

divEditor.addEventListener("mouseup", () => {
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

const splitTextToSubstr = (): textInformationChild[] => {
  let str = "";
  let counter = 0;
  let textChildrenList: textInformationChild[] = [];

  for (let i = 0; i < textInformation.text.length; i++) {
    str += textInformation.text[i];
    textChildrenList[counter] = {
      childText: str,
      isSelectedText: str == selectedText ? true : false,
    };

    if (!isSplitText(i)) continue;
    str = "";
    counter++;
  }
  return textChildrenList;
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

const createTextChildList = () => {
  textInformation = textInformationList[childIndex];
  textInformation.children = splitTextToSubstr();
};

const addTagToText = (tag: string) => {
  let childElement: string | undefined;
  divEditor.innerHTML = "";

  textInformationList.forEach((textInfo) => {
    childElement =
      textInfo.children && createChildElement(textInfo.children, tag);

    divEditor.innerHTML += `<div>${
      childElement?.length ? childElement : textInfo.text
    }</div>`;
    childElement = "";
  });
};

const createChildElement = (
  children: textInformationChild[],
  tag: string
): string => {
  let childElement = "";
  children?.forEach((child) => {
    let childTag = !child.isSelectedText ? "span" : tag;
    childElement += `<${childTag}>${child.childText}</${childTag}>`;
  });
  return childElement;
};

const getCurrentText = (index: number = indexCounter) => {
  let currentHTMLText: string;
  let currentHTMLNode = editorHTMLElements[index] as HTMLElement;

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
  editorHTMLElements = divEditor.childNodes! as any;

  if (!editorHTMLElements) return;
  if (event.key == "Enter") {
    indexCounter = editorHTMLElements.length - 1;
    editorHTMLElements[indexCounter].innerHTML = `<br />`;
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
