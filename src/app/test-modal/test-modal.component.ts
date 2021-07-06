import {Component, Inject, NgZone, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {fabric} from 'fabric'

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-test-modal',
    templateUrl: 'test-modal.component.html',
})
export class TestModalComponent implements OnInit {
    canvas: any
    textString: string
    size: any = {
        width: 1200,
        height: 1000
    }
    OutputContent: string
    readonly = false

    constructor(
        public dialogRef: MatDialogRef<TestModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private ngZone: NgZone) {
    }

    ngOnInit() {
        this.canvas = new fabric.Canvas('fabricSurface', {
            hoverCursor: 'curser',
            selection: true,
            selectionBorderColor: 'blue',
            centeredRotation: true
        })
        this.textString = null
        this.canvas.setWidth(this.size.width)
        this.canvas.setHeight(this.size.height)
        this.OutputContent = null

        this.addImage()
    }

    toggleReadOnly() {
        this.readonly = !this.readonly
    }

    close(): void {
        this.ngZone.run(() => {
            this.dialogRef.close({a: 1})
        })
    }

    submit(): void {
        this.ExportToContent('svg')
        this.ngZone.run(() => {
            this.dialogRef.close({data: this.OutputContent})
        })
    }

    addText() {
        const textString = this.textString
        if (textString.length <= 0) {
            return
        }
        const text = new fabric.IText(textString, {
            left: 10,
            top: 10,
            fontFamily: 'helvetica',
            angle: 0,
            fill: '#000000',
            scaleX: 0.5,
            scaleY: 0.5,
            fontWeight: '',
            hasRotatingPoint: true
        })
        this.extend(text, this.randomId())
        this.canvas.add(text)
        this.selectItemAfterAdded(text)
        this.textString = ''
    }

    addImage(): void {
        fabric.Image.fromURL('/assets/body.png', (sourceImage) => {
            const image = sourceImage.set({left: 0, top: 0, width: 150, height: 214})
            this.canvas.add(image)
        })
    }

    extend(obj, id) {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id
                })
            }
        })(obj.toObject)

    }

    randomId() {
        return Math.floor(Math.random() * 999999) + 1
    }

    selectItemAfterAdded(obj) {
        this.canvas.discardActiveObject().renderAll()
        this.canvas.setActiveObject(obj)
    }

    ExportToContent(input) {
        if (input == 'json') {
            this.OutputContent = JSON.stringify(this.canvas)
        } else if (input == 'svg') {
            this.OutputContent = this.canvas.toSVG()
        }
    }

    addFigure(figure) {
        let add: any
        switch (figure) {
            case 'rectangle':
                add = new fabric.Rect({
                    width: 200, height: 100, left: 10, top: 10, angle: 0,
                    fill: '#3f51b5'
                })
                break
            case 'square':
                add = new fabric.Rect({
                    width: 100, height: 100, left: 10, top: 10, angle: 0,
                    fill: '#4caf50'
                })
                break
            case 'triangle':
                add = new fabric.Triangle({
                    width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
                })
                break
            case 'circle':
                add = new fabric.Circle({
                    radius: 50, left: 10, top: 10, fill: '#ff5722'
                })
                break
        }
        this.extend(add, this.randomId())
        this.canvas.add(add)
        this.selectItemAfterAdded(add)
    }

    addLine(): void {
        const line = new fabric.Line([0, 0, 50, 50], {
            stroke: 'red',
            strokeWidth: 2,
            cornerStyle: 'circle',
            centeredScaling: false,
        })
        this.extend(line, this.randomId())
        this.canvas.add(line)
        this.selectItemAfterAdded(line)
    }
}
