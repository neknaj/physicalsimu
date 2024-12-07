import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length,Time,step } from "./model.js";

function round(x: number,n: number) {
    return Math.round(x*n)/n;
}

class Render2 { // 2D Render
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    center: number[];
    scale: number;
    constructor(canvas: HTMLCanvasElement,width: number,height: number,center: number[],scale: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.height = height;
        this.width = width;
        this.center = center;
        this.scale = scale;
        canvas.height = height;
        canvas.width = width;
    }
    render(t:Time,Points: Point[],Springs: Spring[]) {
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.width,this.height);
        {
            ctx.font = "30px Arial";
            ctx.strokeStyle = `rgb(0,0,0)`;
            ctx.fillStyle = `rgb(255,255,255)`;
            ctx.lineWidth = 3;
            const text: string = `${round(t,100)}s`;
            ctx.strokeText(text, 50, 50);
            ctx.fillText(text, 50, 50);
        }
        for (let i_ in Springs) {
            const i = Number(i_);
            const spring = Springs[i];
            ctx.strokeStyle = `rgba(${255-i*1/10},${255-i*4/10},${i*3/10},0.5)`;
            ctx.beginPath();
            ctx.moveTo((spring.point1.r[0]-this.center[0])*this.scale+this.width/2,(spring.point1.r[1]-this.center[1])*this.scale+this.height/2)
            ctx.lineTo((spring.point2.r[0]-this.center[0])*this.scale+this.width/2,(spring.point2.r[1]-this.center[1])*this.scale+this.height/2)
            ctx.stroke();
        }
        for (let i_ in Points) {
            const i = Number(i_);
            const point = Points[i];
            ctx.fillStyle = `rgb(${255-i*1/10},${255-i*4/10},${i*3/10})`;
            ctx.beginPath();
            ctx.arc((point.r[0]-this.center[0])*this.scale+this.width/2, (point.r[1]-this.center[1])*this.scale+this.height/2, 2, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

export { Render2 };