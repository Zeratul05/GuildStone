
//imporing
var variables = require('../GameFunds/variables'),
    elementalist = require('../ClassSkillTrees/elementalist');

// load created Characters 
// create a character

exports.loadCreatedCharacters = function(key){
    ctx.clear();
    ctx.point(0, 0, 'You have ' + createdCharacters.length + ' characters');    
    
    // print created characters and make the user to create a new if he doesn't have any
    if(createdCharacters.length == 0 || isCreatingCharacter){
        isCreatingCharacter = true;
        ctx.point(0, 2, 'You must create a Character in order to play');
        this.createCharacter(key);
        if(key)
            lastKeyEntered = key.name;
    }
    
    else{        
        var i,
            length = createdCharacters.length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 2 + i *2, 'Champion"name: ' + createdCharacters[i].name);
        
        if(!key)
            return;
        
        if(key.name == 'q')
            ctx.point(0, 10, createdCharacters[indexAtCharacter].name);
            
        if(key.name == 'e')
            return;
        
        if(key.name == 'up' && indexAtCharacter > 0)
            indexAtCharacter--;
        
        if(key.name == 'down' && indexAtCharacter < createdCharacters.length -1)
            indexAtCharacter++;
    }
    
    if(key && key.name == 'backspace'){
        isCreatingCharacter = true;
    }
}

exports.createCharacter = function(key){
    if(!key)
        return;
    
    if(key.name == 'return' && userInput != ' '){
        enterPressed +=1;
        userInput.trimLeft();
        
        if(enterPressed == 1){
            // the Character has: name, class, array of spells and a level counter
            createdCharacters.push({name: userInput});
            enterPressed = 0;
            isCreatingCharacter = false;
            ctx.point(0, 15, 'Press any key to continueue');
            createdCharacters[createdCharacters.length - 1].exp = 0;
            createdCharacters[createdCharacters.length - 1].level = 10;
            createdCharacters[createdCharacters.length - 1].spells = [];
            createdCharacters[createdCharacters.length - 1].canCast = true;
            createdCharacters[createdCharacters.length - 1].duration = 0;
            createdCharacters[createdCharacters.length - 1].attack = 0;
            createdCharacters[createdCharacters.length - 1].tempAttack = 0;
            createdCharacters[createdCharacters.length - 1].hasWindfury = 0;
            
            // in order to bind him to its class script
            this.determineChampionClass
            (createdCharacters[createdCharacters.length - 1]);
            
            
            socket.emit('CreatedCharacters',{username:profileUsername, userID:userID,
                         name:createdCharacters[createdCharacters.length - 1].name,
                         exp:0,level:10,
                         spells: createdCharacters[createdCharacters.length-1].spells
                        });
        }
    
        userInput = ' ';
        return;
    }
    
    // cancel the inputed input
    else if(key.name == 'backspace'){
        if(enterPressed > 0 && lastKeyEntered == 'backspace'){
            if(enterPressed == 1)
                createdCharacters.splice(createdCharacters.length - 1, 1);
            
            enterPressed -= 1;
        }
        
        userInput = ' ';
        return;
    }
    
    if(key.name == 'return' || key.name == 'backspace' || !key.name)
        return;
    
    if(key.name == 'space'){
        userInput += ' ';
        return;
    }
    
    userInput += key.name;
    
    if(enterPressed == 0){
        ctx.point(0, 4, 'Name: ' + userInput);
    }
    
}

exports.getMaxCharacterLevel = function(){
    var i,
        length = createdCharacters.length,
        maxCharacterLevel = 0;
    
    for(i = 0; i < length; i+=1){
        var currentCharacter = createdCharacters[i];
        
        if(currentCharacter.level > maxCharacterLevel)
            maxCharacterLevel = currentCharacter.level;
    }
    
    return maxCharacterLevel;
}

exports.determineChampionClass = function(character){
    elementalist.initilizeElementalistSkills();
        
        // add this property to the champion
      character.skillsTrees = 
                JSON.parse(JSON.stringify(elementalistSkillTrees));  
        
        // implement the first skill
      elementalist.upgradeSkills(character);
}