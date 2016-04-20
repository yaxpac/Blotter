import "../core/";
import "../utils/";
import "../text/";


var blotter_TextsTexture = function(texts) {
  this.init(texts);
}

blotter_TextsTexture.prototype = (function() {

  function _createMapperFromTexts (texts) {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    this.texts = texts;
    this.mapper = new blotter_TextsMapper(texts, { pixelRatio : this.pixelRatio, flipY : true });
    this.width = this.mapper.width * this.pixelRatio;
    this.height = this.mapper.height * this.pixelRatio;
  }

  return {

    constructor : blotter_TextsTexture,

    init : function (texts, pixelRatio) {
// ### - can we please be consistent with this?
      this.pixelRatio = pixelRatio || blotter_CanvasUtils.pixelRatio;
      _createMapperFromTexts.call(this, texts);
    },

    load : function (callback) {
      var self = this,
          loader = new THREE.TextureLoader();

      this.imageSrc = this.mapper.getImage();

      loader.load(this.imageSrc, function(texture) {
        self.texture = texture;
        self.texture.generateMipmaps = false;
        self.texture.minFilter = THREE.LinearFilter;
        self.texture.magFilter = THREE.LinearFilter;
        self.texture.needsUpdate = true;

        callback(self.texture);
      });
    },

    boundsFor : function (text) {
      return this.mapper.boundsFor(text);
    },

    indexFor : function (text) {
      var index = this.texts.indexOf(text);

      if (index == -1) {
// ### - messaging
        blotter_Messaging.logError("Blotter.Material", "Blotter.Text object not found in texture texts");
        return;
      }

      return index;
    }
  }
})();