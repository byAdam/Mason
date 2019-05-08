var system = server.registerSystem(0,0);
var eventName = "mason:magnetUse"
var primaryClient = false
var players = []

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));

	this.registerEventData("mason:molangQuery",{player:false,query:false})
};

system.update = function()
{
	if(players.length>0)
	{
		for(p=0;p<players.length;p++)
		{	
			this.magnetCommand(players[p])
		}
	}

}

system.magnetCommand = function(playerName)
{
	commandData = this.createEventData("minecraft:execute_command")
	commandData.data.command = "execute @e[type=item] ~ ~ ~ tp @s ~ ~ ~ facing @p[r=32,name="+playerName+"]"
	this.broadcastEvent("minecraft:execute_command",commandData)
	commandData.data.command = "execute @e[type=item] ~ ~ ~ detect ^ ^ ^.1 air 0 tp @s ^ ^ ^.2 facing @p[r=32,name="+playerName+"]"
	this.broadcastEvent("minecraft:execute_command",commandData)
}

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "hold"
	event.data.item = "mason:magnet"
	event.data.eventName = eventName
	event.data.returns = ["playerName"]

	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	player = event.data.player

	if(!primaryClient)
	{
		primaryClient = player
	}
}

system.itemUse = function(event) {
	playerName = event.data.playerName
	isHolding = event.data.isHolding

	if(isHolding)
	{
		for(i=0;i<players.length;i++)
		{
			if(players[i][1] == playerName)
			{
				return
			}
		}
		players.push(playerName)
	}

	else
	{
		index = players.indexOf(playerName)
		if(index>-1)
		{
			players.splice(index, 1);
		}
	}
}
