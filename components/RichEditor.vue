<template>
  <div class="rich-editor">
    <rich-editor-formatting-helper></rich-editor-formatting-helper>
    <div class="rich-editor--input-field" contenteditable ref="input" @input="onInput" @keypress="onKeypress" :placeholder="placeholder"></div>
  </div>
</template>

<script>
  import RichEditorFormattingHelper from './RichEditorFormattingHelper.vue'

  export default {
    components: {RichEditorFormattingHelper},
    name: 'rich-editor',
    data () {
      return {
      }
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
      updateValue () {

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

<style scoped>
  div.rich-editor--input-field {
    outline: none;
  }

  div.rich-editor--input-field:empty:before {
    content: attr(placeholder);
    display: block;

    color: gray;
  }
</style>
