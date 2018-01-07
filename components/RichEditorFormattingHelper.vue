<template>
  <div class="rich-editor-formatting-helper" ref="helper" :style="helperStyle">
    <div class="rich-editor-formatting-helper--controls" :style="controlsStyle">
      <span class="rich-editor-formatting-helper--h1" @click="setH1"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='h1'}">
        H
      </span>
      <span class="rich-editor-formatting-helper--h2" @click="setH2"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='h2'}">
        H
      </span>
      <span class="rich-editor-formatting-helper--h3" @click="setH3"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='h3'}">
        H
      </span>
      <span class="rich-editor-formatting-helper--b" @click="setBold"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='b'}">
        b
      </span>
      <span class="rich-editor-formatting-helper--i" @click="setItalics"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='i'}">
        i
      </span>
      <span class="rich-editor-formatting-helper--quote" @click="setQuote"
            :class="{ 'rich-editor-formatting-helper--active': getType()==='blockquote'}">
        "
      </span>
      <span class="rich-editor-formatting-helper--hyperlink" @click="startLinkInput">
        <img src="../assets/hyperlink.svg">
      </span>
    </div>
    <div class="rich-editor-formatting-helper--link-input" :style="linkInputStyle">
      <input placeholder="Paste link here..." v-model="link" @keypress="setHyperlink">
      <span @click="cancelLinkInput">
        ✖
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    name: 'rich-editor-formatting-helper',
    computed: {
      controlsStyle () {
        let _result = {}

        if (this.isLinkInputActive) {
          _result['pointer-events'] = 'none'
          _result['opacity'] = '0'
        } else {
          _result['pointer-events'] = 'auto'
          _result['opacity'] = '1'
        }

        return _result
      },
      linkInputStyle () {
        let _result = {}

        if (this.isLinkInputActive) {
          _result['pointer-events'] = 'auto'
          _result['opacity'] = '1'
        } else {
          _result['pointer-events'] = 'none'
          _result['opacity'] = '0'
        }

        return _result
      }
    },
    data () {
      return {
        link: '',
        linkSelectionRange: null,
        isLinkInputActive: false,
        helperStyle: {
          'top': '0',
          'left': '0'
        }
      }
    },
    methods: {
      adjustHelper () {
        if (window.getSelection().type === 'none') {
          this.hide()
          return
        }
        if ((window.getSelection().anchorNode === null)) {
          this.hide()
          return
        }
        if ((window.getSelection().anchorNode.parentNode.closest('.rich-editor-formatting-helper') !== null)) {
          return
        }
        if ((window.getSelection().anchorNode.parentNode.closest('.rich-editor') !== null)) {
          let _rect = window.getSelection().getRangeAt(0).getBoundingClientRect()

          if (_rect.x === 0) {
            _rect = window.getSelection().anchorNode.getBoundingClientRect()
          }

          if (this.checkMobile() && (window.getSelection().anchorNode.parentNode.closest('.rich-editor-formatting-helper') === null)) {
            let _x = window.pageXOffset + _rect.x
            let _width = this.$refs.helper.offsetWidth
            if (_x + _width + 16 > window.innerWidth) {
              _x = window.innerWidth - _width - 16
            }
            this.helperStyle = {
              left: _x + 'px',
              top: window.pageYOffset + _rect.y + 'px'
            }
          } else {
            this.hide()
          }
        }
      },
      cancelLinkInput () {
        this.isLinkInputActive = false
        this.link = ''
      },
      checkMobile () {
        return (window.getSelection().type === 'Range' || (navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)
        ))
      },
      format (_tag) {
        if (this.getType() !== _tag) {
          document.execCommand('formatBlock', false, _tag)
        } else {
          document.execCommand('formatBlock', false, 'p')
        }
      },
      hide () {
        this.helperStyle = {
          'opacity': 0,
          'left': this.helperStyle.left,
          'top': this.helperStyle.top,
          'pointer-events': 'none'
        }
        this.cancelLinkInput()
      },
      getType () {
        if (window.getSelection().type === 'Range') {
          if (window.getSelection().anchorNode.parentNode.closest('.rich-editor') !== null) {
            return window.getSelection().anchorNode.parentElement.tagName.toLowerCase()
          }
        }
        return null
      },
      setBold () {
        document.execCommand('bold', false)
      },
      setItalics () {
        document.execCommand('italic', false)
      },
      setH1 () {
        this.format('h1')
      },
      setH2 () {
        this.format('h2')
      },
      setH3 () {
        this.format('h3')
      },
      setQuote () {
        this.format('blockquote')
      },
      setHyperlink (_e) {
        if (_e.keyCode === 13) {
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(this.linkSelectionRange)
          document.execCommand('createLink', false, this.link)
          window.getSelection().removeAllRanges()
          this.hide()
        }
      },
      startLinkInput () {
        this.isLinkInputActive = true
        this.linkSelectionRange = window.getSelection().getRangeAt(0)
      }
    },
    mounted () {
      setInterval(this.adjustHelper, 10)
    }
  }
</script>

<style scoped>
  div.rich-editor-formatting-helper {
    position:      absolute;
    background:    rgba(0, 0, 0, 0.9);
    border-radius: 5px;

    transform:     translateY(-120%);
    transition:    opacity .3s;
    overflow:      hidden;
    cursor:        pointer;
  }

  div.rich-editor-formatting-helper--controls {
    display:     flex;
    align-items: flex-end;

    transition:  opacity .3s;
  }

  span {
    display:        block;
    padding:        0.5rem;
    vertical-align: bottom;

    color:          white;
    user-select:    none;
    opacity:        0.75;

    transition:     opacity .3s;
  }

  span.rich-editor-formatting-helper--active {
    opacity: 1;
  }

  span.rich-editor-formatting-helper--h1 {
    font-size:   1.5em;
    font-weight: bold;
  }

  span.rich-editor-formatting-helper--h2 {
    font-size:   1.25em;
    font-weight: bold;
  }

  span.rich-editor-formatting-helper--h3 {

  }

  span.rich-editor-formatting-helper--b {
    font-weight: bold;
  }

  span.rich-editor-formatting-helper--i {
    font-style: italic;
  }

  span.rich-editor-formatting-helper--quote {

  }

  span.rich-editor-formatting-helper--hyperlink img {
    width: 1em;
  }

  span:hover {
    opacity: 1;
  }

  div.rich-editor-formatting-helper--link-input {
    width:       100%;
    height:      100%;
    padding:     0.5rem;
    box-sizing:  border-box;
    position:    absolute;
    top:         0;
    left:        0;

    display:     flex;
    align-items: center;

    transition:  opacity .3s;
  }

  div.rich-editor-formatting-helper--link-input input {
    width:       100%;
    margin:      0;

    background:  none;
    border:      none;
    outline:     none;
    font-family: inherit;
    color:       white;
  }

  div.rich-editor-formatting-helper--link-input span {
    padding: 0;
  }
</style>
