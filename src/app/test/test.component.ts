import {Component, NgZone} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {TestModalComponent} from '../test-modal/test-modal.component'
import {get, replace, startsWith, trim} from 'lodash'

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})
export class TestComponent {

    editor
    isReadOnly = false
    html = null
    tips = [
        ['Hello World.'],
        ['How are you.'],
        ['This is good.'],
        ['Good news.']
    ]

    constructor(public dialog: MatDialog, private ngZone: NgZone) {
    }

    createdQuill(editor) {
        this.editor = editor

        this.editor.on('text-change', (delta, oldDelta, source) => {
            this.html = this.editor.root.innerHTML
            this.autoCompleteTips(source, delta)
        })
    }

    private autoCompleteTips(source, delta) {
        if (source === 'api' || get(delta, 'ops.[1].insert') !== ' ') {
            return
        }

        const selection = this.editor.getSelection()
        const textBefore = this.editor.getText(0, selection.index)
        const regExp = /( \w+ )$/g
        const regExpResult = regExp.exec(textBefore)

        if (regExpResult) {
            const insertText = this.getInsertText(regExpResult)

            if (!insertText) {
                return
            }

            this.editor.insertText(-1, insertText, [], 'api')
            setTimeout(() => {
                this.editor.setSelection(selection.index, insertText.length, 'api')
            }, 1)
        }
    }

    private getInsertText(result: RegExpExecArray) {
        let insertText = ''
        const trimmedResult = trim(result[0])
        for (const tip of this.tips) {
            if (startsWith(tip, trimmedResult)) {
                insertText = replace(tip, trimmedResult, '')
            }
        }
        return insertText
    }

    disable() {
        this.editor.disable()
    }

    enable() {
        this.editor.enable()
    }

    openDialog = () => {
        this.ngZone.run(() => {
            this.dialog.open(TestModalComponent, {
                width: '600px', height: '600px'
            }).afterClosed().subscribe(res => {
                const range = this.editor.getSelection(true)
                this.editor.insertEmbed(range.index, 'image', 'assets/test.svg', 'user')
                var container = document.getElementById("tempSvg")
                container.innerHTML = "<svg>" + res.data + "</svg>"

                // 需要服务器端存储svg code为SVG文件；再插入（quill仅允许几种类型的type，不包含html dom）
                this.editor.insertEmbed(range.index, 'text', res.data, 'user')
            }, cancel => console.log(cancel))
        })
    }

    toggleReadOnly() {
        this.isReadOnly = !this.isReadOnly
    }

    modules = {
        counter: {container: '#counter', unit: 'word'},
        smaller: {container: '#smaller'},
        bigger: {container: '#bigger'},
        imageModal: {
            container: '#image-modal',
            click: this.openDialog
        }
    }

    editorModel = [{
        attributes: {
            font: 'roboto'
        },
        insert: 'test'
    }]
}
