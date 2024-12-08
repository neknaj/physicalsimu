import { Vec3 } from "./vector3.js";
function round(x, n) {
    return Math.round(x * n) / n;
}
class Render2 {
    constructor(canvas, width, height, center, scale, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.height = height;
        this.width = width;
        this.center = center;
        this.scale = scale;
        canvas.height = height;
        canvas.width = width;
        this.beforeRendering = null;
        this.config = config;
    }
    render(t, Points, gravity, Springs) {
        const dt = this.beforeRendering ? Number(new Date()) - this.beforeRendering : null;
        this.beforeRendering = Number(new Date());
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        {
            ctx.font = "20px Arial";
            ctx.strokeStyle = `rgb(0,0,0)`;
            ctx.fillStyle = `rgb(255,255,255)`;
            ctx.lineWidth = 3;
            if (dt) {
                const text = `fps: ${round(1000 / dt, 100)}`;
                ctx.strokeText(text, 30, 30);
                ctx.fillText(text, 30, 30);
            }
            {
                const text = `${round(t, 100)}s`;
                ctx.strokeText(text, this.width - 100, 30);
                ctx.fillText(text, this.width - 100, 30);
            }
        }
        if (this.config.gravitational_field) { // 重力場
            ctx.lineWidth = 0.3;
            for (let j = -1000; j < 1000; j += 50) {
                for (let i = -1500; i < 1500; i += 50) {
                    const p = new Vec3(i, j);
                    let g = gravity.fieldVal(p);
                    ctx.strokeStyle = `rgba(${Math.pow(1.02, g.length)},${g.length * 2},255,${0.001 * Math.pow(g.length, 2)})`;
                    ctx.beginPath();
                    this.arrow(p.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy, p.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).add(g.scale(1 / g.length).scale(Math.log(1 + g.length) * 2.5)).xy);
                    ctx.stroke();
                }
            }
        }
        const colorscale_s = 100 / Springs.length;
        if (this.config.springs)
            for (let i_ in Springs) { // バネ
                const i = Number(i_);
                const spring = Springs[i];
                ctx.lineWidth = 1;
                ctx.strokeStyle = `rgba(${Math.log(1 + spring.force.length) * 10},255,255,0.5)`;
                ctx.beginPath();
                this.path((spring.point1.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy, (spring.point2.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy);
                ctx.stroke();
            }
        const colorscale_p = 100 / Points.length;
        if (this.config.trajectory) { // 軌跡
            for (let i_ in Points) {
                const i = Number(i_);
                const point = Points[i];
                {
                    for (let j = 0; j < point.trajectory.length; j++) {
                        let lp = point.trajectory[j];
                        ctx.fillStyle = `rgba(${255 - i * 1 * colorscale_p},${255 - i * 4 * colorscale_p},${i * 3 * colorscale_p},0.2)`;
                        this.ctx.beginPath();
                        this.circle((lp.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy), j / point.trajectory_len * 2);
                        this.ctx.fill();
                    }
                }
            }
        }
        for (let i_ in Points) {
            const i = Number(i_);
            const point = Points[i];
            { // 質点
                const heightcolor = 50 * Math.pow(1.01, point.r[2]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgb(0,0,0)`;
                ctx.fillStyle = `rgb(${255 - i * 1 * colorscale_p + heightcolor},${255 - i * 4 * colorscale_p + heightcolor},${i * 3 * colorscale_p + heightcolor})`;
                ctx.beginPath();
                this.circle((point.r.subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy), Math.max(Math.min(0 + Math.log(1 + Math.pow(point.m, 10)) / 20, 50), 1));
                ctx.stroke();
                ctx.fill();
            }
        }
        for (let i_ in Points) {
            const i = Number(i_);
            const point = Points[i];
            if (this.config.velocity) { // 速度
                ctx.strokeStyle = `rgba(255,50,0,0.5)`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                this.arrow((point.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy, (point.r.add(point.v.scale(1 / (point.v.length + 0.0001)).scale(10 * Math.log(point.v.length)))).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy);
                ctx.stroke();
            }
            if (this.config.acceleration) { // 加速度
                ctx.strokeStyle = `rgba(10,255,0,0.5)`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                this.arrow((point.r).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy, (point.r.add(point.a.scale(1 / (point.a.length + 0.0001)).scale(10 * Math.log(point.a.length)))).subtract(this.center).Scale(this.scale).Add(new Vec3(this.width / 2, this.height / 2, 0)).xy);
                ctx.stroke();
            }
        }
    }
    circle(p, r) {
        this.ctx.arc(...p, r, 0, Math.PI * 2);
    }
    path(p1, p2) {
        this.ctx.moveTo(...p1);
        this.ctx.lineTo(...p2);
    }
    arrow(p1, p2) {
        this.path(p1, p2);
        let P1 = Vec3.fromArray(p1);
        let P2 = Vec3.fromArray(p2);
        let d = P1.subtract(P2);
        this.path(p2, P2.add(d.rotate(new Vec3(0, 0, 1), +0.7).scale(0.5)).xy);
        this.path(p2, P2.add(d.rotate(new Vec3(0, 0, 1), -0.7).scale(0.5)).xy);
    }
}
export { Render2 };
