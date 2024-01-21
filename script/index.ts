interface textInformations {
  index: number;
  text: string;
  tag?: string;
  startOffset?: number;
  endOffset?: number;
}

let textInformations: textInformations[] = [];
let editorHTMLElements: any[];
let indexCounter = 0;
let textStartIndex: number;
let textEndIndex: number;
const divEditor = document.querySelector("#divEditor")! as HTMLDivElement;

divEditor.addEventListener("mouseup", () => {
  document.addEventListener("selectionchange", () => {
    const textRange = window.getSelection()?.getRangeAt(0)!;
    textStartIndex = textRange.startOffset;
    textEndIndex = textRange.endOffset;
  });
});

const addTagToText = (tag: string) => {
  const text = window.getSelection()?.anchorNode?.parentElement?.textContent;

  (window.getSelection()?.anchorNode?.parentElement)!.innerHTML =
    text?.slice(0, textStartIndex) +
    `<${tag}>` +
    text?.slice(textStartIndex, textEndIndex) +
    `</${tag}>` +
    text?.slice(textEndIndex, text.length);
};

const getCurrentText = (index:number = indexCounter) => {
  let currentHTMLText: string;
  let currentHTMLNode = editorHTMLElements[index] as HTMLElement;
  
  if(currentHTMLNode?.textContent) {
    currentHTMLText = currentHTMLNode?.textContent!;
  } else {
    currentHTMLText = currentHTMLNode?.innerText!;
  }
  return currentHTMLText;
}

const createTextInformation = ():{index: number, text: string} => {
  let currentHTMLText = getCurrentText();
  return {
    index: indexCounter,
    text: currentHTMLText,
  }
}

document.addEventListener("keyup", (event: KeyboardEvent) => {
  editorHTMLElements = divEditor.childNodes! as any;

  if(!editorHTMLElements) return;
  if(event.key == "Enter") indexCounter = editorHTMLElements.length - 1;
  if(findChangedElIndex() > -1) indexCounter = findChangedElIndex();

  textInformations[indexCounter] = createTextInformation();
});

const findChangedElIndex = () => {
 return [...editorHTMLElements].findIndex((_element,index) => (
  getCurrentText(index) != textInformations[index]?.text
 ))
}
