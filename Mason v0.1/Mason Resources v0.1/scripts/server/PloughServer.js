var system = server.registerSystem(0,0);
var eventName = "mason:ploughUse"
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
	event.data.item = "mason:plough"
	event.data.eventName = eventName
	event.data.type = "interact"
	event.data.returns = ["blockData","dataValue","playerName"]

	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}
}

system.itemUse = function(event) {

	identifier = event.data.blockData.__identifier__
	dataValue = event.data.dataValue
	position = event.data.position
	playerName = event.data.playerName

	if(identifier == "minecraft:grass" || (identifier=="minecraft:dirt" && dataValue==0) || identifier == "minecraft:farmland")
	{
		this.ploughBlocks(position,playerName)
	}
}

system.ploughBlocks = function(position,playerName)
{
	commandData = this.createEventData("minecraft:execute_command")
	commandData.data.command = "fill "+(position.x-2)+" "+(position.y-1)+" "+(position.z-2)+" "+(position.x+2)+" "+(position.y+1)+" "+(position.z+2)+" farmland 2 replace grass"
	this.broadcastEvent("minecraft:execute_command",commandData)
	commandData.data.command = "fill "+(position.x-2)+" "+(position.y-1)+" "+(position.z-2)+" "+(position.x+2)+" "+(position.y+1)+" "+(position.z+2)+" farmland 2 replace dirt 0"
	this.broadcastEvent("minecraft:execute_command",commandData)

	commandData.data.command = "execute "+playerName+" ~ ~ ~ playsound use.gravel @s ~ ~ ~ 1 0.8"
	this.broadcastEvent("minecraft:execute_command",commandData)
	
}