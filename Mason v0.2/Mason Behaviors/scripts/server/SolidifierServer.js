var system = server.registerSystem(0,0);
var eventName = "mason:solidifierUse"
var primaryClient = false

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));
};

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "use"
	event.data.item = "mason:solidifier"
	event.data.eventName = eventName
	event.data.returns = ["playerName"]

	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}

system.xpCalculate = function(playerName,xpLevel)
{
	this.runCommand("xp -1L "+playerName)

	if(xpLevel<=15)
	{
		xpPoints = 2*xpLevel+7
	}
	else if(xpLevel<=30)
	{
		xpPoints = 5*xpLevel-38
	}
	else
	{
		xpPoints = 9*xpLevel-158
	}

	xpearCount =  Math.floor(xpPoints/7)

	if(xpLevel<40)
	{
		this.runCommand("give "+playerName+" mason:xpear "+xpearCount)
		this.runCommand("execute "+playerName+" ~ ~ ~ playsound bucket.fill_lava @s ~ ~ ~ 1 3.5")
	}
	else
	{
		this.runCommand("give @a[name="+playerName+",lm=39] mason:xpear "+xpearCount)
		this.runCommand("execute @a[name="+playerName+",lm=39] ~ ~ ~ playsound bucket.fill_lava @s ~ ~ ~ 1 3.5")
	}
}

system.xpCallback = function(event,playerName,lMin,lMax)
{
	if(event.data.statusCode==0)
	{
		if(lMin==lMax || lMax-lMin==1)
		{
			this.xpCalculate(playerName,lMax)
			return
		}
		else
		{
			this.xpBetween(playerName,lMin,Math.round((lMin+lMax)/2))
		}
	}
	else
	{
		if(lMin==1 && lMax==40)
		{
			this.xpCalculate(playerName,40)
			return
		}
		else
		{
			this.xpBetween(playerName,lMax,lMax*2)
		}
	}
}

system.xpBetween = function(playerName,lMin,lMax)
{
	this.executeCommand("/testfor @a[name="+playerName+",lm="+lMin+",l="+lMax+"]",(e) => this.xpCallback(e,playerName,lMin,lMax))
}

system.itemUse = function(event)
{
	playerName = event.data.playerName

	this.runCommand("/replaceitem entity "+playerName+" slot.weapon.mainhand 0 mason:solidifier")
	this.xpBetween(playerName,1,40)
	
}