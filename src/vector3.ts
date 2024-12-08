class Vector3 {
    // キャメルケース: 新オブジェクトを作成
    // パスカルケース: 自身を変更
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static fromArray(v: number[]) {
        return new Vector3(v[0]|0,v[1]|0,v[2]|0);
    }

    // インデックスでのアクセス
    [index: number]: number;
    get [0](): number {
        return this.x;
    }
    set [0](value: number) {
        this.x = value;
    }
    get [1](): number {
        return this.y;
    }
    set [1](value: number) {
        this.y = value;
    }
    get [2](): number {
        return this.z;
    }
    set [2](value: number) {
        this.z = value;
    }

    // 正射影
    get xy(): [number, number] {
        return [this.x,this.y];
    }
    get yz(): [number, number] {
        return [this.y,this.z];
    }
    get zx(): [number, number] {
        return [this.z,this.x];
    }

    // ベクトルの加算
    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    Add(other: Vector3): this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    // ベクトルの減算
    subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    Subtract(other: Vector3): this {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    // スカラー倍
    scale(scalar: number): Vector3 {
      return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    Scale(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    // ベクトルの反転
    get flip(): Vector3 {
        return new Vector3(-this.x,-this.y,-this.z);
    }
    Flip(): this {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    // 内積
    dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // 外積
    cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }
    Cross(other: Vector3): this {
        const x = this.y * other.z - this.z * other.y;
        const y = this.z * other.x - this.x * other.z;
        const z = this.x * other.y - this.y * other.x;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    // ベクトルの長さ
    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // 正規化（単位ベクトル）
    normalize(): Vector3 {
        const len = this.length;
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
        return this.scale(1 / len);
    }
    Normalize(): this {
        const len = this.length;
        if (len === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
        return this.Scale(1 / len);
    }

    // 行列とベクトルの積
    multiplyVector3(m: Matrix4): Vector3 {
        const e = m.elements;
        const x = e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3];
        const y = e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3];
        const z = e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3];
        return new Vector3(x, y, z);
    }
    MultiplyVector3(m: Matrix4): Vector3 {
        const e = m.elements;
        const x = e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3];
        const y = e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3];
        const z = e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3];
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    rotate(axis: Vector3, angle: number): Vector3 {
        return this.multiplyVector3(Matrix4.rotation(axis, angle));
    }

    Rotate(axis: Vector3, angle: number): Vector3 {
        return this.MultiplyVector3(Matrix4.rotation(axis, angle));
    }

    // ベクトルの文字列表現
    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}
class Matrix4 {
    elements: number[][];

    constructor(elements?: number[][]) {
        if (elements) {
            if (elements.length !== 4 || elements.some(row => row.length !== 4)) {
                throw new Error("Matrix4 must be initialized with a 4x4 array.");
            }
            this.elements = elements;
        } else {
            this.elements = Matrix4.identity().elements;
        }
    }

    // 単位行列を生成
    static identity(): Matrix4 {
        return new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    // 任意軸回りの回転行列を生成
    static rotation(axis: Vector3, angle: number): Matrix4 {
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
    multiplyVector3(v: Vector3): Vector3 {
        const e = this.elements;
        const x = e[0][0] * v.x + e[0][1] * v.y + e[0][2] * v.z + e[0][3];
        const y = e[1][0] * v.x + e[1][1] * v.y + e[1][2] * v.z + e[1][3];
        const z = e[2][0] * v.x + e[2][1] * v.y + e[2][2] * v.z + e[2][3];
        return new Vector3(x, y, z);
    }

    // 行列同士の積
    multiplyMatrix4(m: Matrix4): Matrix4 {
        const a = this.elements;
        const b = m.elements;
        const result: number[][] = Array.from({ length: 4 }, () => new Array(4).fill(0));

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
    toString(): string {
        return this.elements.map(row => row.map(val => val.toFixed(2)).join(" ")).join("\n");
    }
}


export { Vector3 };
export { Vector3 as Vec3 };