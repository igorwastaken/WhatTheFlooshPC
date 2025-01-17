import kaboom from "kaboom";
import Game from "./scenes/game.mjs";
import NewGame from "./scenes/newGame.mjs";
import Menu from "./scenes/menu.mjs";
import Credits from "./scenes/credits.mjs";
import Dev from "./scenes/devScreen.mjs";
import Shop from "./scenes/shop.mjs";
import AFK from "./scenes/afk.mjs";
import Difficulty from "./scenes/difficulty.mjs";
import Settings from "./scenes/settings.mjs";
import Stats from "./scenes/stats.mjs";

// Initialize kaboom context

kaboom({
    global: true,
    width: window.innerWidth,
    height: window.innerHeight,
    fullscreen: true,
    background: [16, 52, 175],
    stretch: false,
    letterbox: true,
    canvas: document.getElementById("gamecanvas"),
    loadingScreen: false
});

onLoading((progress) => {
    drawRect({
        width: width(),
        height: height(),
        color: rgb(16, 52, 175),
    })
})
setFullscreen(!isFullscreen())
// Initialize localStorage defaults
const defaultSettings = {
    "score.easy": 0,
    "score.normal": 0,
    "score.hard": 0,
    "score.impossible": 0,
    "coins": 0,
    "qt": false,
    "skin": "bean",
    "settings:fullscreen": 0,
    "settings:muted": 0,
};

for (const [key, value] of Object.entries(defaultSettings)) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, value);
    }
}

if (localStorage.getItem("qt") === "true") {
    localStorage.setItem("skin", "burbur");
}

// Load assets
const assets = {
    sprites: {
        "bean": "./sprites/bean.png",
        "cloud": "./sprites/elements/clouds.png",
        "plane": "./sprites/elements/plane.png",
        "star": "./sprites/elements/star.png",
        "coin": "./sprites/elements/coins.gif",
        "impulse": "./sprites/elements/impulse.png",
        "rocket": "./sprites/elements/rockets.png",
        "rocket2": "./sprites/elements/rockets2.png",
        "rocket3": "./sprites/elements/rockets3.png",
        "ufo": "./sprites/elements/ufo.png",
        "clock": "./sprites/elements/clock.png",
        "empadinhalogo": "./sprites/elements/empadinhalogo.png",
        "nerd": "./sprites/skins/nerd.png",
        "skull": "./sprites/skins/skull.png",
        "burbur": "./sprites/skins/burbur.png",
        "poop": "./sprites/skins/poop.png",
        "instagram": "./sprites/icons/instagram.png",
        "settings": "./sprites/icons/settings.png",
        "cl:AL": "./sprites/icons/Cl-AL.png",
    },
    sounds: {
        "20190724-old": "./sounds/20190724.mp3",
        "20190724": "./sounds/20190724-Remake.wav",
        "score": "./sounds/score.mp3",
        "20210616": "./sounds/20210616.mp3",
        "20190724 2-old": "./sounds/20190724 2.mp3",
        "20190724 2": "./sounds/20190724-Menu.wav",
        "intro": "./sounds/20190724-2-_intro-loop_.mp3",
        "20210511": "./sounds/20210511.mp3",
        "coin": "./sounds/ui/retro-game-coin-pickup-jam-fx-1-00-03.mp3",
        "ui:click": "./sounds/ui/click.mp3",
    }
};

for (const [key, value] of Object.entries(assets.sprites)) {
    loadSprite(key, value);
}

for (const [key, value] of Object.entries(assets.sounds)) {
    loadSound(key, value)
        .then(() => {
            console.log(`${key} carregado com sucesso`);
        })
        .catch((err) => {
            console.error(`Erro ao carregar ${key}:`, err);
        });
}

onKeyPress('escape', () => {
    window.close();
})

// Initialize and configure background music
const musicConfig = {
    "menu": play("20190724 2", {
        loop: true,
        volume: 0
    }),
    "game": play("20190724", {
        loop: true,
        volume: 0
    }),
    "credits": play("20210511", {
        loop: true,
        volume: 0
    }),
    "stats": play("20210616", {
        loop: true,
        volume: 0
    }),
    "intro": play("intro", {
        loop: true,
        volume: 0
    })
};

// Scene definitions
scene("game:easy", () => {
    configureMusic("game");
    Game(1, 0.5, 1, "easy");
});

scene("game:normal", () => {
    configureMusic("game");
    Game(0.1, 1, 0.4, "normal");
});

scene("game:hard", () => {
    configureMusic("game");
    Game(3, 6, 1.2, "hard");
});

scene("game:impossible", () => {
    configureMusic("game");
    Game(2, 3, 2, "impossible");
});

scene("settings", () => {
    Settings();
    setCursor("default");
});

scene("afk", () => {
    configureMusic("intro");
    setCursor("none");
    AFK(1);
});

scene("difficulty", () => {
    setCursor("default");
    Difficulty();
});

scene("devOptions", () => {
    setCursor("default");
    Dev();
});

scene("menu", () => {
    configureMusic("menu");
    setCursor("default");
    document.getElementById("gamecanvas").style.width = "100%";
    document.getElementById("gamecanvas").style.height = "100%";
    Menu();
});

scene("credits", () => {
    setCursor("default");
    configureMusic("credits");
    Credits();
});

scene("shop", () => {
    setCursor("default");
    configureMusic("credits");
    Shop();
});

scene("stats", () => {
    setCursor("default");
    configureMusic("stats");
    Stats();
});

scene("loading", () => {
    setCursor("none");
    var progress = 0;
    const interval = setInterval(() => {
        progress++;
        if (progress > 99) {
            go("menu");
            clearInterval(interval);
        }
    }, rand(0.4, 1));
});

scene("warning", () => {
    setCursor("default");
    configureMusic("menu")
    /*if (!localStorage.getItem("language")) {
      showLanguageSelection();
    } else {
      showUpdateNotice();
    }*/
    showUpdateNotice();
});
var oldScene = undefined;

function configureMusic(scene) {
    if (localStorage.getItem("settings:muted") == 0) {
        if (oldScene !== undefined) musicConfig[oldScene].volume = 0;
        if (oldScene !== scene) musicConfig[scene].play();
        musicConfig[scene].volume = 1;
    } else {
        musicConfig["menu"].volume = 0;
        musicConfig["credits"].volume = 0;
        musicConfig["game"].volume = 0;
        console.log(scene)
    }
    oldScene = scene
}

function showLanguageSelection() {
    const firstText = add([
        text("Welcome, first of all, choose your language.", {
            size: 20,
            width: width(),
            align: "center"
        }),
        pos(0, 10),
        area(),
    ]);
    const portuguese = add([
        text("Português", {
            size: 16,
            width: width(),
            align: "center"
        }),
        pos(0, 60),
        area(),
    ]);
    const english = add([
        text("English", {
            size: 16,
            width: width(),
            align: "center"
        }),
        pos(0, 100),
        area(),
    ]);
    portuguese.onClick(() => {
        localStorage.setItem("language", "pt-br");
        go("menu");
    });
    english.onClick(() => {
        localStorage.setItem("language", "en");
        go("menu");
    });
}

function showUpdateNotice() {
    const padding = 20;
    // Função para centralizar o texto horizontalmente
    function centerText(textObj) {
        textObj.pos.x = (width() - textObj.width) / 2;
    }

    // Adiciona o título "Novidades"
    const firstText = add([
        text("Novidades:", {
            size: 26
        }),
        pos(20, 10),
        area(),
        scale(2),
    ]);

    // Adiciona o texto das novidades
    const secondText = add([
        text("• Aplicativo Nativo do What The Floosh Game para android!\n• Correção e melhorias\n• Última atualização: 25/06/2024", {
            size: 18,
            width: width() - 40, // Mantém uma margem de 20px de cada lado
        }),
        pos(20, firstText.pos.y + firstText.height + 20), // Ajusta a posição vertical abaixo do título
        area(),
    ]);

    // Adiciona o texto de instrução
    const playText = add([
        text("Pressione qualquer tecla para jogar", {
            size: 14,
            width: width()
        }),
        pos(20, height() - padding - 15),
        area(),
    ]);

    // Funções de navegação
    onClick(() => {
        // if (localStorage.getItem("settings:muted") == 0) burp();
        go("menu");
    });
    onKeyPress(() => {
        // if (localStorage.getItem("settings:muted") == 0) burp();
        go("menu");
    });

}

go("loading");

debug.inspect = window.location.hash === "#debug";