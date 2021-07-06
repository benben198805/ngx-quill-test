import 'quill'

export interface Config {
  container: string
  unit: 'word' | 'char'
}

export interface QuillInstance {
  on: any
  getText: any
}

export default class Smaller {
  quill: QuillInstance
  options: Config

  constructor(quill, options) {
    this.quill = quill
    this.options = options

    const container = document.querySelector(this.options.container)
    const parent = document.querySelector("#parent")
    container.innerHTML = "<span> Sm </span>"

    container.addEventListener('click',  () => {
      console.log(this.quill);
      console.log(this.options);
      console.log(parent);
      parent.className = 'small-parent';
    });
  }
}
