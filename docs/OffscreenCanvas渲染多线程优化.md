---
outline: deep
---

# OffscreenCanvas 渲染多线程优化

下面是一个用 `OffscreenCanvas + Worker` 把绘制逻辑放到工作线程的最小示例（用于验证主线程阻塞时动画仍能继续）。

原始 HTML 代码如下（你也可以直接运行 `docs/OffscreenCanvas渲染多线程优化.html` 进行对照）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>OffscreenCanvas Worker 动画</title>
</head>
<body>
    <h1>欢迎来到我的网页</h1>
    <div>
        <canvas id="myCanvas" width="400" height="400"></canvas>
        <button id="blockButton">开始阻塞任务</button>
    </div>
    <script>
        // 1. Worker 代码（直接在 OffscreenCanvas 上绘制）
        const workerCode = `
            let offscreen;
            let x = 50;

            self.onmessage = function(e) {
                if (e.data.type === 'init') {
                    // 接收主线程转移过来的 OffscreenCanvas
                    offscreen = e.data.canvas;
                    const ctx = offscreen.getContext('2d');
                    
                    function draw() {
                        ctx.clearRect(0, 0, offscreen.width, offscreen.height);
                        
                        x += 2;
                        if (x > offscreen.width) x = -100;

                        ctx.fillStyle = '#4285f4';
                        ctx.fillRect(x, 50, 100, 100);

                        ctx.fillStyle = 'white';
                        ctx.font = '20px Arial';
                        ctx.fillText('Moving Rectangle', x + 10, 110);

                        // 通知主线程已绘制一帧（可选）
                        self.postMessage({ type: 'frame' });

                        setTimeout(draw, 16);
                    }
                    draw();
                }
            };
        `;

        // 2. 创建 Blob Worker
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        // 3. 关键：将页面 Canvas 转移给 Worker
        const canvas = document.getElementById('myCanvas');
        const offscreen = canvas.transferControlToOffscreen();

        // 4. 将 OffscreenCanvas 转移给 Worker（transferable 对象）
        worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);

        // 5. 接收 Worker 消息（仅用于调试）
        worker.onmessage = function(e) {
            if (e.data.type === 'frame') {
                console.log('Worker 已绘制一帧');
            }
        };

        // 6. 模拟阻塞操作（验证 Worker 动画不受影响）
        function blockingTask(duration) {
            const start = Date.now();
            while (Date.now() - start < duration) {}
        }

        const button = document.querySelector('button');
        button.onclick = () => {
            console.log('开始阻塞主线程 3 秒...');
            blockingTask(3000);
            console.log('主线程阻塞结束');
        };
    </script>
</body>
</html>
```

