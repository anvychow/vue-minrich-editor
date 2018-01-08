<template>
  <div class="rich-editor">
    <rich-editor-formatting-helper></rich-editor-formatting-helper>
    <div class="rich-editor--input-field" contenteditable ref="input" @input="onInput" @keypress="onKeypress"
         @paste="onPaste" @drop="onDrop" @dragover="onDragOver" :placeholder="placeholder"></div>
  </div>
</template>

<script>
  import RichEditorFormattingHelper from './RichEditorFormattingHelper.vue'

  export default {
    components: {RichEditorFormattingHelper},
    name: 'rich-editor',
    data () {
      return {}
    },
    methods: {
      onInput (_e) {
        this.$emit('input', _e.target.innerHTML)
      },
      onKeypress (_e) {
        if (_e.keyCode === 13) {
          if (window.getSelection().anchorNode.parentNode.tagName === 'DIV') {
            document.execCommand('formatBlock', false, 'p')
          }
          this.value = 'test'
          console.log(this.value)
        }
      },
      onDrop (_e) {
        _e.preventDefault()

        this.addAllImagesFromTransfer(_e.dataTransfer.items)
      },
      onDragOver (_e) {
        _e.preventDefault()
      },
      onPaste (_e) {
        _e.preventDefault()

        if (_e.clipboardData.types.indexOf('text/plain') > -1) {
          if (this.convertMedia(_e.clipboardData.getData('text/plain'))) {
            console.log(123)
          } else {
            document.execCommand('insertText', false, _e.clipboardData.getData('text/plain'))
          }
        } else {
          this.addAllImagesFromTransfer(_e.clipboardData.items)
        }
      },
      addImage (_file) {
        let _reader = new FileReader()

        _reader.onload = (_e) => {
          let _html = '<img src="' + _e.target.result + '">'
          document.execCommand('insertHTML', false, _html)
        }

        _reader.readAsDataURL(_file)
      },
      addAllImagesFromTransfer (_items) {
        for (let i = 0; i < _items.length; i++) {
          let _file = _items[i].getAsFile()
          if (_file.type.indexOf('image') > -1) {
            this.addImage(_file)
          }
        }
      },
      convertMedia (_link) {
        let _patternVimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g
        let _patternYouTube = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g

        if (_link.indexOf('iframe') > -1) {
          return false
        }

        if (_patternYouTube.test(_link)) {
          let _html = '<div class="rich-editor--iframe-container" contenteditable="false"><iframe class="rich-editor--iframe" src="https://www.youtube.com/embed/$1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe></div><br>'
          _html = _link.replace(_patternYouTube, _html)
          document.execCommand('insertHTML', false, _html)
          return true
        } else if (_patternVimeo.test(_link)) {
          let _html = '<div class="rich-editor--iframe-container" contenteditable="false"><iframe class="rich-editor--iframe" src="//player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe></div><br>'
          _html = _link.replace(_patternVimeo, _html)
          document.execCommand('insertHTML', false, _html)
          return true
        }
        return false
      }
    },
    props: {
      value: {
        type: String
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    mounted () {
      if (this.value !== undefined) {
        this.$refs.input.innerHTML = this.value
      }
    }
  }
</script>

<style>
  div.rich-editor--input-field {
    outline: none;
  }

  div.rich-editor--input-field:empty:before {
    content: attr(placeholder);
    display: block;

    color:   gray;
  }

  div.rich-editor--input-field img {
    max-width: 100%;
    display:   block;
    margin:    0 auto;
  }

  div.rich-editor--iframe-container {
    position:      relative;
    width:         100%;
    padding-top:   43%;
    margin-bottom: 1em;
    background: black;
  }

  iframe.rich-editor--iframe {
    width:    100%;
    height:   100%;

    position: absolute;
    top:      0;
    left:     0;
  }
</style>
