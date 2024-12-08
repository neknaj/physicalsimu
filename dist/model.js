import { Vec3 } from "./vector3.js";
class Point {
    constructor(initialPosition, mass) {
        this.r = initialPosition;
        this.v = new Vec3(0, 0, 0);
        this.f = new Vec3(0, 0, 0);
        this.a = new Vec3(0, 0, 0);
        this.m = mass;
        this.trajectory = [];
        this.trajectory_len = 1000;
    }
    addForce(f) {
        this.f.Add(f);
    }
    updatePosition(t, step) {
        this.a = this.f.scale(1 / this.m);
        this.v.Add(this.a.scale(step));
        this.r.Add(this.v.scale(step));
        this.f = new Vec3(0, 0, 0);
    }
    saveTrajectory() {
        this.trajectory.push(this.r.copy);
        if (this.trajectory.length > this.trajectory_len) {
            this.trajectory.shift();
        }
    }
}
class Spring {
    constructor(springConstant, naturalLength, point1, point2) {
        this.k = springConstant;
        this.l = naturalLength;
        this.point1 = point1;
        this.point2 = point2;
    }
    affect() {
        const sub = this.point2.r.subtract(this.point1.r);
        const f1 = sub.normalize().Scale(this.k * Math.abs(sub.length - this.l));
        this.point1.addForce(f1);
        this.point2.addForce(f1.flip);
    }
    get force() {
        const sub = this.point2.r.subtract(this.point1.r);
        const f1 = sub.normalize().Scale(this.k * Math.abs(sub.length - this.l));
        return f1;
    }
}
class Gravity {
    constructor(points = []) {
        this.points = points;
    }
    affect() {
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            const F = new Vec3(0, 0, 0);
            for (let j = 0; j < this.points.length; j++) {
                if (i != j) {
                    const point2 = this.points[j];
                    const r = point2.r.subtract(point1.r);
                    const f = r.normalize().scale(Gravity.G * (point1.m * point2.m) / (Math.pow(r.length, 2)));
                    F.Add(f);
                }
            }
            point1.addForce(F);
        }
    }
    fieldVal(p) {
        const g_ = new Vec3();
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            let r = p.subtract(point.r);
            g_.Add(r.scale(point.m / (Math.pow(r.length, 3))));
        }
        return g_.Scale(-Gravity.G);
    }
}
Gravity.G = 6.6743015 * (Math.pow(10, -11));
export { Point };
export { Spring };
export { Gravity };
