import k from "./kaplayCtx";
import BattleScene from "./scenes/BattleScene";
import MainScreen from "./scenes/MainScreen";

// Load Fonts
k.loadFont("Viga", "https://fonts.gstatic.com/s/viga/v15/xMQbuFFdSaiX_QI.ttf");
k.loadFont("Inter", "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf");

// Load Sprites
k.loadSprite("nebula", "/nebula.png");
k.loadSprite("heart", "/heart_icon.png");
k.loadSprite("droplet", "/droplet_icon.png");
k.loadSprite("SolSprite", "/SolSprite.png");
k.loadSprite("AlloySprite", "/AlloySprite.png");
k.loadSprite("SaberSprite", "/SaberSprite.png");
k.loadSprite("MaxSprite", "/MaxSprite.png");
k.loadSprite("pointer", "/pointer-o.png");

k.scene("main", MainScreen);
k.scene("battle", BattleScene);

k.go("main");
