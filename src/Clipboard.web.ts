declare var ClipboardItem : {  
  new (input: { [contentType: string]: any }): any;
}

declare var navigator: {
  clipboard: {
    readText(): Promise<string>;
    writeText(data: string): Promise<void>;
    write(data:Array<any>):Promise<void>;
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

  setImage(imageUrl:string){
    if (navigator && navigator.clipboard) {
        fetch(imageUrl, { mode: 'no-cors'})
          .then((response) => {
              if (!response.ok) { throw Error(response.statusText); }
              return response.blob();
          })
          .then( blob => new Promise( callback =>{
              let reader = new FileReader() ;
              reader.onload = function(){
                  var base64Data = this.result as string;
                  base64Data = base64Data.replace("image/jpeg", "image/png");
                  (async() => {
                      const base64Response = await fetch(base64Data);
                      const blob = await base64Response.blob()
                      navigator.clipboard.write([
                          new ClipboardItem({
                              ["image/png"]: blob
                          })
                      ]).then(() => {
                          console.log('Copied')
                      })
                  })();
              };
              reader.readAsDataURL(blob);
          }))       
          .catch(() => {
              // const errorDesc = this.props.translate('textInputFocusable.problemGettingImageYouPasted');
              // Growl.error(errorDesc);
          });
    }
  },
};
