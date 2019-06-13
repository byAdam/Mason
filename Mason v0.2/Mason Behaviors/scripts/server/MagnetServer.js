var system = server.registerSystem(0,0);
var eventName = "mason:magnetUse"
var primaryClient = false

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));

	this.registerEventData("mason:molangQuery",{player:false,query:false})
};

system.update = function()
{
	this.runCommand("execute @p[tag=MasonMagnet] ~ ~ ~ function magnet")
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
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
		this.runCommand("tag "+playerName+" add MasonMagnet")
	}
	else
	{
		this.runCommand("tag "+playerName+" remove MasonMagnet")
	}
}
