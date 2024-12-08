import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length,Time } from "./model.js";

function round(x: number,n: number) {
    return Math.round(x*n)/n;
}

class Render2 { // 2D Render
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    center: Vec3;
    scale: number;
    beforeRendering: Time|null;
    constructor(canvas: HTMLCanvasElement,width: number,height: number,center: Vec3,scale: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.height = height;
        this.width = width;
        this.center = center;
        this.scale = scale;
        canvas.height = height;
        canvas.width = width;
        this.beforeRendering = null;
    }
    render(t:Time,Points: Point[],Springs: Spring[]) {
        const dt: Time|null = this.beforeRendering?Number(new Date())-this.beforeRendering:null;
        this.beforeRendering = Number(new Date());
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.width,this.height);
        {
            ctx.font = "20px Arial";
            ctx.strokeStyle = `rgb(0,0,0)`;
            ctx.fillStyle = `rgb(255,255,255)`;
            ctx.lineWidth = 3;
            if (dt) {
                const text: string = `fps: ${round(1000/dt,100)}`;
                ctx.strokeText(text, 10, 30);
                ctx.fillText(text, 10, 30);
            }
            {
                const text: string = `${round(t,100)}s`;
                ctx.strokeText(text, this.width-60, 30);
                ctx.fillText(text, this.width-60, 30);
            }
        }
        const colorscale_s: number = 100/Springs.length;
        for (let i_ in Springs) {
            const i = Number(i_);
            const spring = Springs[i];
            const forcecolor = 5*1.0001**spring.force.length;
            ctx.lineWidth = Math.max(Math.min(1.001**spring.force.length,0.1),5);
            ctx.strokeStyle = `rgba(${255-i*1*colorscale_s+forcecolor},${255-i*4*colorscale_s+forcecolor},${i*3*colorscale_s+forcecolor},0.2)`;
            ctx.beginPath();
            ctx.moveTo( ...(spring.point1.r.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy) );
            ctx.lineTo( ...(spring.point2.r.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy) );
            ctx.stroke();
        }
        const colorscale_p: number = 100/Points.length;
        for (let i_ in Points) {
            const i = Number(i_);
            const point = Points[i];
            { // 質点
                const heightcolor = 50*1.01**point.r[2];
                ctx.fillStyle = `rgb(${255-i*1*colorscale_p+heightcolor},${255-i*4*colorscale_p+heightcolor},${i*3*colorscale_p+heightcolor})`;
                this.circle((point.r.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy) , Math.max(Math.min(0+Math.log(1+point.m**10)/20,50),0.1))
            }
            { // 速度
                ctx.strokeStyle = `rgba(255,0,0,0.5)`;
                ctx.lineWidth = 2;
                this.arrow(
                    (point.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy,
                    (point.r.add(point.v.scale(1/(point.v.length+0.0001)).scale(10*Math.log(point.v.length)))).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy
                )
            }
            { // 加速度
                ctx.strokeStyle = `rgba(0,255,0,0.5)`;
                ctx.lineWidth = 3;
                this.arrow(
                    (point.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy,
                    (point.r.add(point.a.scale(1/(point.a.length+0.0001)).scale(10*Math.log(point.a.length)))).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width/2,this.height/2,0)).xy
                )
            }
        }
    }
    circle(p:[number,number],r:number) {
        this.ctx.beginPath();
        this.ctx.arc( ...p ,r, 0,Math.PI*2);
        this.ctx.fill();
    }
    path(p1:[number,number],p2:[number,number]) {
        this.ctx.beginPath();
        this.ctx.moveTo( ...p1 );
        this.ctx.lineTo( ...p2 );
        this.ctx.stroke();
    }
    arrow(p1:[number,number],p2:[number,number]) {
        this.path(p1,p2);
        let P1 = Vec3.fromArray(p1);
        let P2 = Vec3.fromArray(p2);
        let d = P1.subtract(P2);
        this.path(p2,P2.add(d.rotate(new Vec3(0,0,1),+0.7).scale(0.5)).xy);
        this.path(p2,P2.add(d.rotate(new Vec3(0,0,1),-0.7).scale(0.5)).xy);
    }
}

export { Render2 };