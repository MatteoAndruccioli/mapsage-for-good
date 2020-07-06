<template>
  <div class="cropper-container">
    <div class="img-container">
      <img @load="handleImageChange" ref="image" :src="src"/>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'ImageCropper',
  props: ['src'],
  data() {
    return {
      cropper: null,
      croppedImage: null,
      image: null
    };
  },
  methods: {
    handleImageChange() {
      if (this.cropper != null) {
        this.cropper.destroy()
      }
      this.cropper = new Cropper(this.image, {
        zoomable: false,
        scalable: false,
        aspectRatio: 1,
        crop: () => {
          const canvas = this.cropper.getCroppedCanvas()
          this.croppedImage = canvas.toDataURL("image/png")
          this.$emit("cropEvent", this.croppedImage)
        }
      })
    }
  },
  mounted() {
    this.image = this.$refs.image
  }
};
</script>

<style>
  .cropper-container {
    display: flex;
    flex-direction: column;
  },
  .img-container {
    width: 30em;
    height: 20em;
  }
</style>
