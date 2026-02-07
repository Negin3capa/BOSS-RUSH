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
k.loadSprite("EDYSprite", "/SolSprite.png");
k.loadSprite("ENZOSprite", "/AlloySprite.png");
k.loadSprite("SABRINASprite", "/SaberSprite.png");
k.loadSprite("MAXSprite", "/MaxSprite.png");

// Load Hurt Sprites
k.loadSprite("HurtEDY", "/HurtSprites/HurtSol.png");
k.loadSprite("HurtENZO", "/HurtSprites/HurtAlloy.png");
k.loadSprite("HurtSABRINA", "/HurtSprites/HurtSaber.png");
k.loadSprite("HurtMAX", "/HurtSprites/HurtMax.png");

// Load Downed Sprites
k.loadSprite("DownedEDY", "/DownedSprites/DownedSol.png");
k.loadSprite("DownedENZO", "/DownedSprites/DownedAlloy.png");
k.loadSprite("DownedSABRINA", "/DownedSprites/DownedSaber.png");
k.loadSprite("DownedMAX", "/DownedSprites/DownedMax.png");

// Load Victory Sprites
k.loadSprite("VictoryEDY", "/VictorySprites/VictorySol.png");
k.loadSprite("VictoryENZO", "/VictorySprites/VictoryAlloy.png");
k.loadSprite("VictorySABRINA", "/VictorySprites/VictorySaber.png");
k.loadSprite("VictoryMAX", "/VictorySprites/VictoryMax.png");

k.loadSprite("pointer", "/pointer-o.png");

k.scene("main", MainScreen);
k.scene("battle", BattleScene);
k.scene("encounter_select", EncounterSelectScene);

k.go("main");
