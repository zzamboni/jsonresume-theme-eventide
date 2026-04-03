import { indentWithTab } from '@codemirror/commands'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import debounce from 'debounce'
import resume from './sample-resume.js'

import { render } from '../index.js'
import './editor.css'

const DESKTOP_BREAKPOINT = 720
const DEFAULT_EDITOR_WIDTH = 45
const MIN_EDITOR_WIDTH = 20
const MAX_EDITOR_WIDTH = 60
const STORAGE_KEY = 'eventide-editor-width-v3'

const body = document.body
const preview = document.querySelector('.preview-pane')
const editorPane = document.querySelector('.editor-pane')
const splitter = document.querySelector('.splitter')

const clamp = value => Math.min(MAX_EDITOR_WIDTH, Math.max(MIN_EDITOR_WIDTH, value))
const readStoredWidth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.userSet && Number.isFinite(parsed.width) ? clamp(parsed.width) : null
  } catch {
    return null
  }
}

const setEditorWidth = (width, { persist = false } = {}) => {
  const clamped = clamp(width)
  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    editorPane.style.width = `${Math.round((window.innerWidth * clamped) / 100)}px`
  } else {
    editorPane.style.width = ''
  }
  if (persist) localStorage.setItem(STORAGE_KEY, JSON.stringify({ width: clamped, userSet: true }))
}

setEditorWidth(readStoredWidth() ?? DEFAULT_EDITOR_WIDTH)

window.addEventListener('resize', () => {
  setEditorWidth(readStoredWidth() ?? DEFAULT_EDITOR_WIDTH)
})

if (splitter) {
  const stopDrag = () => {
    body.classList.remove('is-resizing')
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', stopDrag)
  }

  const onPointerMove = event => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return
    const width = (event.clientX / window.innerWidth) * 100
    setEditorWidth(width, { persist: true })
  }

  splitter.addEventListener('pointerdown', event => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return
    event.preventDefault()
    body.classList.add('is-resizing')
    splitter.setPointerCapture(event.pointerId)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDrag, { once: true })
  })
}

const renderPreview = debounce(resume => (preview.srcdoc = render(resume)), 200)
renderPreview(resume)

new EditorView({
  doc: JSON.stringify(resume, null, '  '),
  extensions: [
    basicSetup,
    oneDark,
    EditorView.lineWrapping,
    EditorView.updateListener.of(
      ({ docChanged, state }) => docChanged && renderPreview(JSON.parse(state.doc.toString())),
    ),
    keymap.of([indentWithTab]),
    json(),
  ],
  parent: editorPane,
})
