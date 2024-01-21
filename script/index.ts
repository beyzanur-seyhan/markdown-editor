interface textInformations {
  index: number;
  text: string;
  tag?: string;
  startOffset?: number;
  endOffset?: number;
}

let textInformations: textInformations[] = [];
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

const createTextInformation = (editorHTMLElements:any):{index: number, text: string} => {
  let currentHTMLNode = editorHTMLElements[indexCounter] as HTMLElement;
  let currentHTMLText = editorHTMLElements.length == 1 ? 
  currentHTMLNode?.textContent! : currentHTMLNode?.innerText!;

  return {
    index: indexCounter,
    text: currentHTMLText,
  }
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  let editorHTMLElements = divEditor.childNodes! as any;

  if(!editorHTMLElements) return;
  if(event.key == "Enter") indexCounter = editorHTMLElements.length 

  textInformations[indexCounter] = createTextInformation(editorHTMLElements);
  console.log(textInformations)
});


