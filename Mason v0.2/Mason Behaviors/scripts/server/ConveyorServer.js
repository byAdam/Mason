var system = server.registerSystem(0,0);
var eventName = "mason:conveyorUse"
var primaryClient = false
var players = []

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));

};

system.update = function()
{
	this.runCommand("/function conveyor")
}

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "place"
	event.data.eventName = eventName
	event.data.returns = ["playerName"]

	event.data.block = "mason:conveyor_belt_north"
	this.broadcastEvent("mason:registerTool",event)

	event.data.block = "mason:conveyor_belt_south"
	this.broadcastEvent("mason:registerTool",event)

	event.data.block = "mason:conveyor_belt_east"
	this.broadcastEvent("mason:registerTool",event)

	event.data.block = "mason:conveyor_belt_west"
	this.broadcastEvent("mason:registerTool",event)

	event.data.block = "mason:conveyor_belt_up"
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
	player = event.data.player
	playerName = event.data.playerName
	position = event.data.position
	
	playerRotation = this.getComponent(player,"minecraft:rotation")
	playerYaw = playerRotation.data.y
	playerPitch = playerRotation.data.x
	command = "setblock "+position.x+" "+position.y+" "+position.z+" conveyor_belt_"

	if(playerPitch >= 75 || playerPitch <= -75)
	{
		this.runCommand(command+"up")
	}
	else if(playerYaw >= 135 || playerYaw <= -135)
	{
		this.runCommand(command+"south")
	}
	else if(playerYaw > -135 &&  playerYaw < -45)
	{
		this.runCommand(command+"west")
	}
	else if(playerYaw >= -45 && playerYaw <= 45)
	{
		this.runCommand(command+"north")
	}
	else
	{
		this.runCommand(command+"east")
	}
}


system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}