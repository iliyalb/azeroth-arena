let GameManager = {
    setGameStart: function (classType) {
        this.resetPlayer(classType);
        this.setPreFight();
    },
    resetPlayer: function (classType) {
        switch (classType) {
            // Type, Health, Resource, Strength, Agility, Intelligence
            case "Warrior":
                player = new Player(classType, 150, 0, 100, 10, 10);
                break;
            case "Hunter":
                player = new Player(classType, 125, 10, 75, 25, 10);
                break;
            case "Priest":
                player = new Player(classType, 100, 100, 10, 10, 100);
                break;
            case "Shaman":
                player = new Player(classType, 125, 50, 25, 50, 25);
                break;
            case "Warlock":
                player = new Player(classType, 100, 100, 10, 10, 90);
                break;
            case "Druid":
                player = new Player(classType, 115, 50, 25, 40, 35);
                break;
            case "Paladin":
                player = new Player(classType, 150, 50, 70, 10, 20);
                break;
            case "Rogue":
                player = new Player(classType, 115, 10, 10, 100, 1);
                break;
            case "Deathknight":
                player = new Player(classType, 140, 10, 90, 5, 5);
                break;
            case "Mage":
                player = new Player(classType, 100, 100, 10, 10, 100);
                break;
            case "Monk":
                player = new Player(classType, 115, 75, 20, 80, 10);
                break;
            case "Demonhunter":
                player = new Player(classType, 125, 50, 30, 70, 10);
                break;
            default:
                alert("Choose a character!");
                break;
        }
        let getInterface = document.querySelector(".interface");
        getInterface.innerHTML = "<img src='img/hero/" +
            classType.toLowerCase() + ".jpg' class='img-avatar'><div><h3>" +
            classType + "</h3><p class='health-player'>Health: " +
            player.health + "</p><p>Resource: " +
            player.resource + "</p><p>Strength: " +
            player.strength + "</p><p>Agility: " +
            player.agility + "</p><p>Intelligence: " +
            player.intelligence + "</p></div>";
    },
    setPreFight: function () {
        let getHeader = document.querySelector(".header");
        let getActions = document.querySelector(".actions");
        let getArena = document.querySelector(".arena");
        getHeader.innerHTML = '<p>Task: Find an enemy</p>'
        getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="GameManager.setFight()">Search for an enemy</a>';
        getArena.style.visibility = "visible";
    },
    setFight: function () {
        let getHeader = document.querySelector(".header");
        let getActions = document.querySelector(".actions");
        let getEnemy = document.querySelector(".enemy");

        // Type, Health, Resource, Strength, Agility, Intelligence
        let enemy00 = new Enemy("Scourge", 120, 0, 10, 100, 10);
        let enemy01 = new Enemy("Murloc", 125, 50, 100, 10, 10);
        let enemy02 = new Enemy("Void", 150, 100, 10, 10, 100);
        let chooseRandomEnemy = Math.floor(Math.random() * Math.floor(3));
        console.log(chooseRandomEnemy);
        switch (chooseRandomEnemy) {
            case 0:
                enemy = enemy00;
                break;
            case 1:
                enemy = enemy01;
                break;
            case 2:
                enemy = enemy02;
                break;
        }
        getHeader.innerHTML = '<p>Task: Choose your action</p>';
        getActions.innerHTML = '<a href="#" class="btn-prefight" onclick="PlayerMoves.calcAttack()">Attack</a>';
        getEnemy.innerHTML = "<img src='img/enemy/" +
            enemy.enemyType.toLowerCase() + ".jpg' alt='" + enemy.enemyType + "'class='img-avatar'><div><h3>" +
            enemy.enemyType + "</h3><p class='health-enemy'>Health: " +
            enemy.health + "</p><p>Resource: " +
            enemy.resource + "</p><p>Strength: " +
            enemy.strength + "</p><p>Agility: " +
            enemy.agility + "</p><p>Intelligence: " +
            enemy.intelligence + "</p></div>";
    }
}