import { prop, cache } from 'tfrp';
import { on } from 'remini';

describe('should work decorators', () => {

  test('prop with first set', () => {
    const spy = jest.fn();
    class A {
      i = 5;
      @prop b = this.i;
    }
    const a = new A();
    expect(a.b).toBe(5);
    a.b = 10;
    on(() => a.b, spy);
    a.b = 11;
    expect(spy).toBeCalledWith(11, 10);
    expect(spy).toBeCalledTimes(1);
  });

  test('prop without first set', () => {
    const spy = jest.fn();
    class A {
      @prop m?: number;
    }
    const a = new A();
    expect(a.m).toBeUndefined();
    on(() => a.m, spy);
    a.m = 10;
    expect(spy).toBeCalledWith(10, void 0);
    expect(spy).toBeCalledTimes(1);
  });

  test('cache', () => {
    const spy = jest.fn();
    const spy_cache = jest.fn();
    class A {
      @prop b = 0;
      @cache get c() {
        spy_cache();
        return this.b + this.b
      }
    }
    const a = new A();
    on(() => a.c, spy);
    expect(a.c).toBe(0);
    expect(a.c).toBe(0);
    expect(spy).toBeCalledTimes(0);
    expect(spy_cache).toBeCalledTimes(1); spy_cache.mockReset();

    a.b = 10;
    expect(spy).toBeCalledWith(20, 0);
    expect(a.c).toBe(20);
    expect(a.c).toBe(20);
    expect(spy_cache).toBeCalledTimes(1);
  });

  test('prop initializer context', () => {
    class B {
      constructor(
        public a: A
      ) {};
    }
    class A {
      @prop b = new B(this);
    }
    const a = new A();

    expect(a.b.a).toBe(a);
  });

});
