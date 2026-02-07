import k from "./kaplayCtx";
import BattleScene from "./scenes/BattleScene";
import MainScreen from "./scenes/MainScreen";
import EncounterSelectScene from "./scenes/EncounterSelectScene";

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

// Load Hurt Sprites
k.loadSprite("HurtSol", "/HurtSprites/HurtSol.png");
k.loadSprite("HurtAlloy", "/HurtSprites/HurtAlloy.png");
k.loadSprite("HurtSaber", "/HurtSprites/HurtSaber.png");
k.loadSprite("HurtMax", "/HurtSprites/HurtMax.png");

// Load Downed Sprites
k.loadSprite("DownedSol", "/DownedSprites/DownedSol.png");
k.loadSprite("DownedAlloy", "/DownedSprites/DownedAlloy.png");
k.loadSprite("DownedSaber", "/DownedSprites/DownedSaber.png");
k.loadSprite("DownedMax", "/DownedSprites/DownedMax.png");

k.loadSprite("pointer", "/pointer-o.png");

k.scene("main", MainScreen);
k.scene("battle", BattleScene);
k.scene("encounter_select", EncounterSelectScene);

k.go("main");
