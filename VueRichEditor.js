import RichEditor from './components/RichEditor.vue'

const VueRichEditorPlugin = {
  install (Vue, options) {
    Vue.component(RichEditor.name, RichEditor)
  }
}

export default VueRichEditorPlugin
