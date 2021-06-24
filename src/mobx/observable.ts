export function observable<T extends object>(obj: T) {
  return new Proxy(obj, {
    set: (target: T, key: string | Symbol, value: any) => {
      const result = Reflect.set(target, key as keyof T, value);

      return result;
    },
  });
}
