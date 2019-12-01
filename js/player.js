let player;

function Player(classType, health, resource, strength, agility, intelligence) {
    this.classType = classType;
    this.health = health;
    this.resource = resource;
    this.strength = strength;
    this.agility = agility;
    this.intelligence = intelligence;
}

let PlayerMoves = {
    calcAttack: function () {
        let getPlayerAgility = player.agility;
        let getEnemyAgility = enemy.agility;

        let playerAttack = function () {
            let calcBaseDamage;
            if (player.resource > 0) {
                calcBaseDamage = player.strength * (player.resource / 100);
            }
            else {
                calcBaseDamage = player.strength * (player.agility / 100);
            }
            let offsetDamage = Math.floor(Math.random() * Math.floor(10));
            let calcOutputDamage = calcBaseDamage + offsetDamage;
            let numberOfHits = Math.floor(Math.random() * Math.floor(player.agility / 10) / 2) + 1;
            let attackValues = [calcOutputDamage, numberOfHits];

            return attackValues;
        }

        let enemyAttack = function () {
            let calcBaseDamage;
            if (enemy.resource > 0) {
                calcBaseDamage = enemy.strength * (enemy.resource / 100);
            }
            else {
                calcBaseDamage = enemy.strength * (enemy.agility / 100);
            }
            let offsetDamage = Math.floor(Math.random() * Math.floor(10));
            let calcOutputDamage = calcBaseDamage + offsetDamage;
            let numberOfHits = Math.floor(Math.random() * Math.floor(enemy.agility / 10) / 2) + 1;
            let attackValues = [calcOutputDamage, numberOfHits];

            return attackValues;
        }

        let getPlayerHealth = document.querySelector(".health-player");
        let getEnemyHealth = document.querySelector(".health-enemy");

        if (getPlayerAgility >= getEnemyAgility) {
            let playerAttackValues = playerAttack();
            let totalDamage = playerAttackValues[0] * playerAttackValues[1];
            enemy.health = enemy.health - totalDamage;
            alert("You hit " + playerAttackValues[0] + " damage " + playerAttackValues[1] + " times.");

            if (enemy.health <= 0) {
                alert("✅ You win! Refresh browser to play again");
                getPlayerHealth.innerHTML = 'Health: ' + player.health;
                getEnemyHealth.innerHTML = 'Health: 0';
            }
            else {
                getEnemyHealth.innerHTML = 'Health: ' + enemy.health;
                let enemyAttackValues = enemyAttack();
                let totalDamage = enemyAttackValues[0] * [1];
                player.health = player.health - totalDamage;
                alert("Enemy hit " + enemyAttackValues[0] + " damage " + enemyAttackValues[1] + " times.");

                if (player.health <= 0) {
                    alert("❌ You lose! Refresh the browser to play again");
                    getPlayerHealth.innerHTML = 'Health: 0';
                    getEnemyHealth.innerHTML = 'Health: ' + enemy.health;
                }
                else {
                    getPlayerHealth.innerHTML = 'Health: ' + player.health;
                }
            }
        }
        else if (getEnemyAgility > getPlayerAgility) {
            let enemyAttackValues = enemyAttack();
            let totalDamage = enemyAttackValues[0] * enemyAttackValues[1];
            player.health = player.health - totalDamage;
            alert("Enemy hit " + enemyAttackValues[0] + " damage " + enemyAttackValues[1] + " times.");

            if (player.health <= 0) {
                alert("❌ You lose! Refresh browser to play again");
                getPlayerHealth.innerHTML = 'Health: 0';
                getEnemyHealth.innerHTML = 'Health: ' + enemy.health;
            }
            else {
                getPlayerHealth.innerHTML = 'Health: ' + player.health;
                let playerAttackValues = playerAttack();
                let totalDamage = playerAttackValues[0] * [1];
                enemy.health = enemy.health - totalDamage;
                alert("You hit " + playerAttackValues[0] + " damage " + playerAttackValues[1] + " times.");

                if (enemy.health <= 0) {
                    alert("✅ You win! Refresh the browser to play again");
                    getPlayerHealth.innerHTML = 'Health: ' + player.health;
                    getEnemyHealth.innerHTML = 'Health: 0';
                }
                else {
                    getEnemyHealth.innerHTML = 'Health: ' + enemy.health;
                }
            }
        }
    }

}