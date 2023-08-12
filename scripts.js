const greetings = window.greetings;
let shownGreetings = ["Hi, Mooncake!"];

// 更新问候语
function changeGreeting() {
    let randomGreeting = "";

    do {
        randomGreeting =
            greetings[Math.floor(Math.random() * greetings.length)];
    } while (shownGreetings.includes(randomGreeting));

    if (shownGreetings.length === greetings.length) {
        shownGreetings = [];
    } else {
        shownGreetings.push(randomGreeting);
    }

    document.getElementById("greeting").textContent = randomGreeting;

    const uploadedImage = sessionStorage.getItem("uploadedImage");
    if (uploadedImage) {
        document.body.style.backgroundImage = `url(${uploadedImage})`;
    }
}

// 处理上传的图片文件
document.getElementById("imageInput").addEventListener(
    "change",
    (e) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            sessionStorage.setItem("uploadedImage", event.target.result);
            document.body.style.backgroundImage = `url(${event.target.result})`;
        };
        reader.readAsDataURL(e.target.files[0]);
        e.target.value = ""; // 重置输入值
    },
    false
);

const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 300;

function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
    };
}

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
};

Particle.prototype.update = function () {
    // 更新粒子位置、速度和绘制粒子
    this.x +=
        this.x + this.radius > canvas.width || this.x - this.radius < 0
            ? -this.velocity.x
            : this.velocity.x;
    this.y +=
        this.y + this.radius > canvas.height || this.y - this.radius < 0
            ? -this.velocity.y
            : this.velocity.y;
    this.draw();
};

// 创建粒子属性并初始化粒子
function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 3 + 1,
                `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
                }, 0.6)`
            )
        );
    }
}

// 更新粒子并调用动画帧
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => particle.update());
}

// 鼠标交互
canvas.addEventListener("mousemove", (event) => {
    particles.forEach((particle) => {
        const dx = event.clientX - particle.x;
        const dy = event.clientY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            particle.velocity.x = dx / 20;
            particle.velocity.y = dy / 20;
        }
    });
});

canvas.addEventListener("click", (event) => {
    particles.push(
        new Particle(
            event.clientX,
            event.clientY,
            Math.random() * 3 + 1,
            `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
            }, 0.6)`
        )
    );
});

createParticles();
animateParticles();