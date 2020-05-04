export default {
  methods: {
    convertToBlobWebWorker: function (imageData) {
      return new Promise((resolve, reject) => {
        const actions = [
          {
            message: 'convertFile', func: data => {
              importScripts(data.url+'/statics/js/encoder.js');
              return encode(data.image, 70);
            }

          }
        ];
        let worker = this.$worker.create(actions);
        worker.postMessage('convertFile', [{image:imageData, url:document.location.protocol + '//' + document.location.host}])
          .then(result => {
            resolve(result)
          })


      })


    }
  }
}
