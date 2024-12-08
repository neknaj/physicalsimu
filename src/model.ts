import { Vec3 } from "./vector3.js";

export type Position = Vec3;
export type Velocity = Vec3;
export type Acceleration = Vec3;
export type Force = Vec3;
export type Mass = number;
export type SpringConstant = number;
export type Length = number;
export type Time = number;

class Point {
    r: Position;
    v: Velocity;
    a: Acceleration;
    f: Force;
    m: Mass;

    constructor(initialPosition: Position,mass: Mass) {
        this.r = initialPosition;
        this.v = new Vec3(0,0,0);
        this.f = new Vec3(0,0,0);
        this.a = new Vec3(0,0,0);
        this.m = mass;
    }

    addForce(f: Force) {
        this.f.Add(f);
    }
    updatePosition(t: Time,step: Time) {
        this.a = this.f.scale(1/this.m);
        this.v.Add(this.a.scale(step));
        this.r.Add(this.v.scale(step));
        this.f = new Vec3(0,0,0);
    }
}

class Spring {
    k: SpringConstant;
    l: number;
    point1: Point;
    point2: Point;
    constructor(springConstant: SpringConstant,naturalLength: Length,point1: Point,point2: Point) {
        this.k = springConstant;
        this.l = naturalLength;
        this.point1 = point1;
        this.point2 = point2;
    }
    affect() {
        const sub = this.point2.r.subtract(this.point1.r);
        const f1 = sub.normalize().Scale(this.k*Math.abs(sub.length-this.l));
        this.point1.addForce(f1);
        this.point2.addForce(f1.flip);
    }
    get force(): Force {
        const sub = this.point2.r.subtract(this.point1.r);
        const f1 = sub.normalize().Scale(this.k*Math.abs(sub.length-this.l));
        return f1;
    }
}

class Gravity {
    static G: number = 6.6743015*(10**-11);
    points: Point[];
    constructor (points: Point[] = []) {
        this.points = points;
    }
    affect() {
        for (let i=0;i<this.points.length;i++) {
            let point1: Point = this.points[i];
            const F: Force = new Vec3(0,0,0);
            for (let j=0;j<this.points.length;j++) {
                if (i!=j) {
                    const point2: Point = this.points[j];
                    const r: Vec3 = point2.r.subtract(point1.r);
                    const f = r.normalize().scale(Gravity.G*(point1.m*point2.m)/(r.length**2));
                    F.Add(f);
                }
            }
            point1.addForce(F);
        }
    }
    fieldVal(p: Position) {
        const g_ = new Vec3();
        for (let i=0;i<this.points.length;i++) {
            let point: Point = this.points[i];
            let r = p.subtract(point.r);
            g_.Add(r.scale(point.m/(r.length**3)));
        }
        return g_.Scale(-Gravity.G);
    }
}


export { Point };
export { Spring };
export { Gravity };