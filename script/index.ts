let textStartIndex: number;
let textEndIndex: number;
const divEditor = document.getElementById("divEditor")! as HTMLDivElement;

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
