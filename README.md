# Memos

一个碎片化知识记录工具。

仅用了屈指可数的 libs: React + TypeScript + Less + Vite 🙌

---

为何做这个？

- 实践 **卢曼卡片盒笔记法**；
- 用于记录：📅 每日/周计划、💡 突发奇想、📕 读后感...
- 代替了我在微信上经常使用的“文件传输助手”；
- 打造一个属于自己的轻量化“卡片”笔记簿；

有何特点呢？

- ✨ 开源项目；
- 😋 精美且细节的视觉样式；
- 📑 体验优良的交互逻辑；

## Deployment

1. Install Docker. (Check official docs [here](https://docs.docker.com/get-started/).)
2. Make sure you have docker accessible from your terminal. Try `docker -v` to see if it correctly prints some version info. 
3. Input `docker run --name memos -p 8080:8080 -v ~/memos-data/:/data/ -d neosmemo/memos`. For details of every argument passed, check [here](https://docs.docker.com/engine/reference/commandline/run/).
4. Now you should be able to access the app from your browser via http://localhost:8080. 
5. If anything doesn't work, [file an issue](https://github.com/boojack/insmemo-web/issues/new), please. 

## Update

We recommend using [watchtower](https://github.com/containrrr/watchtower) to auto-update your deployment:

`docker run --name watchtower -v /var/run/docker.sock:/var/run/docker.sock -d containrrr/watchtower --cleanup memos`


Enjoy it and have fun~
