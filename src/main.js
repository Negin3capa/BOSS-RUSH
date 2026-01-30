import k from "./kaplayCtx";
import BattleScene from "./scenes/BattleScene";
import MainScreen from "./scenes/MainScreen";

// Load Fonts
k.loadFont("Viga", "https://fonts.gstatic.com/s/viga/v15/xMQbuFFdSaiX_QI.ttf");
k.loadFont("Inter", "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf");

k.scene("main", MainScreen);
k.scene("battle", BattleScene);

k.go("main");
