export class Vector {
	private buffer: number[]

	constructor(bufferOrSize?: number[] | number) {
		if (Array.isArray(bufferOrSize)) {
			this.buffer = [...bufferOrSize]
		} else if (typeof bufferOrSize === 'number') {
			this.buffer = new Array(bufferOrSize).fill(0)
		} else {
			this.buffer = []
		}
	}

	public getBuffer(): number[] {
		return this.buffer
	}

	public clone(): Vector {
		return new Vector(this.buffer)
	}

	public get(index: number): number {
		return this.buffer[index]
	}

	public set(index: number, value: number): void {
		this.buffer[index] = value
	}

	public get rows(): number {
		return this.buffer.length
	}

	public equals(other: Vector): boolean {
		if (this.rows !== other.rows) return false
		for (let i = 0; i < this.rows; i++) {
			if (this.buffer[i] !== other.get(i)) {
				return false
			}
		}
		return true
	}

	public add(other: Vector): void {
		for (let i = 0; i < this.rows; i++) {
			this.buffer[i] += other.get(i)
		}
	}

	public mul(coef: number): void {
		for (let i = 0; i < this.rows; i++) {
			this.buffer[i] *= coef
		}
	}

	public norm(): number {
		let max = 0
		for (let i = 0; i < this.rows; i++) {
			max = Math.max(max, Math.abs(this.buffer[i]))
		}
		return max
	}

	public static add(a: Vector, b: Vector): Vector {
		const result = a.clone()
		result.add(b)
		return result
	}

	public static multiply(a: Vector, coef: number): Vector {
		const result = a.clone()
		result.mul(coef)
		return result
	}

	public toString(): string {
		return this.buffer.map(x => x.toFixed(4).padEnd(18)).join('')
	}
}
