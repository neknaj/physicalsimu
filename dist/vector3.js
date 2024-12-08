class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromArray(v) {
        return new Vector3(v[0] | 0, v[1] | 0, v[2] | 0);
    }
    get copy() {
        return new Vector3(this.x, this.y, this.z);
    }
    get [0]() {
        return this.x;
    }
    set [0](value) {
        this.x = value;
    }
    get [1]() {
        return this.y;
    }
    set [1](value) {
        this.y = value;
    }
    get [2]() {
        return this.z;
    }
    set [2](value) {
        this.z = value;
    }
    // 正射影
    get xy() {
        return [this.x, this.y];
    }
    get yz() {
        return [this.y, this.z];
    }
    get zx() {
        return [this.z, this.x];
    }
    // ベクトルの加算
    add(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    Add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    // ベクトルの減算
    subtract(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    Subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    // スカラー倍
    scale(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    Scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    // ベクトルの反転
    get flip() {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    Flip() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    // 内積
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    // 外積
    cross(other) {
        return new Vector3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    Cross(other) {
        const x = this.y * other.z - this.z * other.y;
        const y = this.z * other.x - this.x * other.z;
        const z = this.x * other.y - this.y * other.x;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    // ベクトルの長さ
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    // 正規化（単位ベクトル）
    normalize() {
        const len = this.length;
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
        return this.scale(1 / len);
    }
    Normalize() {
        const len = this.length;
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
        return this.Scale(1 / len);
    }
    // 行列とベクトルの積
    multiplyVector3(m) {
        const e = m.elements;
        const x = e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3];
        const y = e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3];
        const z = e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3];
        return new Vector3(x, y, z);
    }
    MultiplyVector3(m) {
        const e = m.elements;
        const x = e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3];
        const y = e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3];
        const z = e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3];
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    rotate(axis, angle) {
        return this.multiplyVector3(Matrix4.rotation(axis, angle));
    }
    Rotate(axis, angle) {
        return this.MultiplyVector3(Matrix4.rotation(axis, angle));
    }
    // ベクトルの文字列表現
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}
class Matrix4 {
    constructor(elements) {
        if (elements) {
            if (elements.length !== 4 || elements.some(row => row.length !== 4)) {
                throw new Error("Matrix4 must be initialized with a 4x4 array.");
            }
            this.elements = elements;
        }
        else {
            this.elements = Matrix4.identity().elements;
        }
    }
    // 単位行列を生成
    static identity() {
        return new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }
    // 任意軸回りの回転行列を生成
    static rotation(axis, angle) {
        const normalizedAxis = axis.normalize();
        const { x: u, y: v, z: w } = normalizedAxis;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const oneMinusCos = 1 - cos;
        return new Matrix4([
            [cos + u * u * oneMinusCos, u * v * oneMinusCos - w * sin, u * w * oneMinusCos + v * sin, 0],
            [v * u * oneMinusCos + w * sin, cos + v * v * oneMinusCos, v * w * oneMinusCos - u * sin, 0],
            [w * u * oneMinusCos - v * sin, w * v * oneMinusCos + u * sin, cos + w * w * oneMinusCos, 0],
            [0, 0, 0, 1],
        ]);
    }
    // 行列とベクトルの積
    multiplyVector3(v) {
        const e = this.elements;
        const x = e[0][0] * v.x + e[0][1] * v.y + e[0][2] * v.z + e[0][3];
        const y = e[1][0] * v.x + e[1][1] * v.y + e[1][2] * v.z + e[1][3];
        const z = e[2][0] * v.x + e[2][1] * v.y + e[2][2] * v.z + e[2][3];
        return new Vector3(x, y, z);
    }
    // 行列同士の積
    multiplyMatrix4(m) {
        const a = this.elements;
        const b = m.elements;
        const result = Array.from({ length: 4 }, () => new Array(4).fill(0));
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                result[row][col] =
                    a[row][0] * b[0][col] +
                        a[row][1] * b[1][col] +
                        a[row][2] * b[2][col] +
                        a[row][3] * b[3][col];
            }
        }
        return new Matrix4(result);
    }
    // 行列の文字列表現
    toString() {
        return this.elements.map(row => row.map(val => val.toFixed(2)).join(" ")).join("\n");
    }
}
export { Vector3 };
export { Vector3 as Vec3 };
