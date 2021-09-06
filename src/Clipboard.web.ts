declare var ClipboardItem : {  
  new (input: { [contentType: string]: any }): any;
}

declare var navigator: {
  clipboard: {
    readText(): Promise<string>;
    writeText(data: string): Promise<void>;
    write(data:Array<any>): Promise<void>;
  };
};

declare var document: any;

export const Clipboard = {
  getString(): Promise<string> {
    if (navigator && navigator.clipboard) {
      return navigator.clipboard.readText();
    } else {
      const el = document.createElement('textarea');
      document.body.appendChild(el);
      el.select();
      document.execCommand('paste');
      const value = el.innerText;
      document.body.removeChild(el);
      return Promise.resolve(value);
    }
  },

  setString(content: string) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    } else {
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
  /** 
   * Copy Image to clipboard   
   * @param imageUrl url string of image to copy clipboard.
  */
  async setImage(imageURL: string): Promise<void> {
      if (navigator && navigator.clipboard) {
        const response: Response = await fetch(imageURL);
        if (!response.ok) { throw Error(response.statusText); }
	      const blob: Blob = await response.blob();
	      const reader = new FileReader();
        reader.onload = async () => {
          let base64Data = reader.result as string;
          base64Data = base64Data.replace("image/jpeg", "image/png");
          const base64Response: Response = await fetch(base64Data);
          const innerBlob: Blob = await base64Response.blob();
          await navigator.clipboard.write([new ClipboardItem({"image/png": innerBlob})]);
        }
        await reader.readAsDataURL(blob);
      }
  },
};
