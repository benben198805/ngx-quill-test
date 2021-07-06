import 'quill'

export interface Config {
  container: string
  click: () => {}
}

export interface QuillInstance {
  on: any
  getText: any
}

export default class ImageModal {
  quill: QuillInstance
  options: Config

  constructor(quill, options) {
    this.quill = quill
    this.options = options

    const container = document.querySelector(this.options.container)
    container.innerHTML = "<span> Img </span>"


    container.addEventListener('click', () => {
      this.options.click();
    });
  }
}
