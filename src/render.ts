import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length } from "./model.js";

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
    render(Points: Point[],Springs: Spring[]) {
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.width,this.height);
        for (let i_ in Springs) {
            const i = Number(i_);
            const spring = Springs[i];
            ctx.strokeStyle = `rgba(0,${255-i*50},${i*50},0.5)`;
            ctx.beginPath();
            ctx.moveTo(spring.point1.r[0]*this.scale+(this.width/2),spring.point1.r[1]*this.scale+(this.height/2))
            ctx.lineTo(spring.point2.r[0]*this.scale+(this.width/2),spring.point2.r[1]*this.scale+(this.height/2))
            ctx.stroke();
        }
        for (let i_ in Points) {
            const i = Number(i_);
            const point = Points[i];
            ctx.fillStyle = `rgb(0,${255-i*50},${i*50})`;
            ctx.beginPath();
            ctx.arc(point.r[0]*this.scale+(this.width/2), point.r[1]*this.scale+(this.height/2), 10, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

export { Render2 };