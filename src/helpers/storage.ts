/**
 * storage controller
 */
class Storage {
  public get(keys: StorageKey[]): Partial<StorageData> {
    const data = {} as Partial<StorageData>;

    for (const key of keys) {
      try {
        const stringifyValue = localStorage.getItem(key);
        if (stringifyValue !== null) {
          const val = JSON.parse(stringifyValue);
          data[key] = val;
        }
      } catch (error) {
        console.error("Get storage failed in ", key);
      }
    }

    return data;
  }

  public set(data: Partial<StorageData>) {
    let key: StorageKey;

    for (key in data) {
      try {
        const stringifyValue = JSON.stringify(data[key]);
        localStorage.setItem(key, stringifyValue);
      } catch (error) {
        console.error("Save storage failed in ", key);
      }
    }
  }

  public getAsync(keys: StorageKey[]): Promise<Partial<StorageData>> {
    return new Promise((resolve, reject) => {
      const data = {} as Partial<StorageData>;

      for (const key of keys) {
        try {
          const stringifyValue = localStorage.getItem(key);
          if (stringifyValue !== null) {
            const val = JSON.parse(stringifyValue);
            data[key] = val;
          }
        } catch (error) {
          console.error("Get storage failed in ", key);
          reject("Get error");
        }
      }

      resolve(data);
    });
  }

  public setAsync(data: Partial<StorageData>): Promise<void> {
    return new Promise((resolve, reject) => {
      let key: StorageKey;

      for (key in data) {
        try {
          const stringifyValue = JSON.stringify(data[key]);
          localStorage.setItem(key, stringifyValue);
        } catch (error) {
          console.error("Save storage failed in ", key);
          reject("Save error");
        }
      }

      resolve();
    });
  }
}

export default new Storage();
