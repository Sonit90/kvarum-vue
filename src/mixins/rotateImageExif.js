export default {
methods: {
 getRotation(file){
   return new Promise((resolve, reject) => {
     this.getOrientation(file).then((orientation) => {
       switch (orientation) {
         case 8:
           resolve(90);
           break;
         case 3:
           resolve(180);
           break;
         case 6:
           resolve(90);
           break;
       }
       resolve(0);
     })
   })
  },
getOrientation(file) {
  return new Promise((resolve, reject) => {

  let reader = new FileReader();

 reader.onload = function(event) {
    let view = new DataView(event.target.result);

    if (view.getUint16(0, false) !== 0xFFD8) return resolve(-2);

    let length = view.byteLength,
      offset = 2;

    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xFFE1) {
        if (view.getUint32(offset += 2, false) !== 0x45786966) {
          return resolve(-1);
        }
        let little = view.getUint16(offset += 6, false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;

        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) === 0x0112)
            return resolve(view.getUint16(offset + (i * 12) + 8, little));
      }
      else if ((marker & 0xFF00) !== 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return resolve(-1);
  }

  reader.readAsArrayBuffer(file.slice(0, 1024));
  })
},


  }
}
