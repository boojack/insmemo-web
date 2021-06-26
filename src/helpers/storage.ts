/**
 * storage helper
 */
export namespace storage {
  export function get(keys: StorageKey[]): Partial<StorageData> {
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

  export function set(data: Partial<StorageData>) {
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

  export function emitStorageChangedEvent() {
    const iframeEl = document.createElement("iframe");
    iframeEl.style.display = "none";
    document.body.appendChild(iframeEl);

    iframeEl.contentWindow?.localStorage.setItem("t", Date.now().toString());
    iframeEl.remove();
  }

  export const preferences = (() => {
    const cachePrefers = storage.get([
      "shouldSplitMemoWord",
      "shouldHideImageUrl",
      "tagTextClickedAction",
      "shouldUseMarkdownParser",
      "showDarkMode",
    ]);
    const temp = {
      shouldSplitMemoWord: cachePrefers.shouldSplitMemoWord ?? true,
      shouldHideImageUrl: cachePrefers.shouldHideImageUrl ?? true,
      shouldUseMarkdownParser: cachePrefers.shouldUseMarkdownParser ?? true,
      tagTextClickedAction: cachePrefers.tagTextClickedAction ?? "copy",
      showDarkMode: cachePrefers.showDarkMode ?? false,
    };
    storage.set({ ...temp });
    return temp;
  })();
}
