var system = server.registerSystem(0,0);
var eventName = "mason:phaserUse"
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
	event.data.item = "mason:phaser"
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

system.itemUse = function(event) 
{
	playerName = event.data.playerName

	this.runCommand("/replaceitem entity "+playerName+" slot.weapon.mainhand 0 phaser")

	playerRotation = this.getComponent(player,"minecraft:rotation")
	playerYaw = playerRotation.data.y

	if(playerYaw >= 135 || playerYaw <= -135)
	{
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~ ~ ~-2 air 0 execute @s ~ ~ ~ detect ~ ~1 ~-2 air 0 playsound mob.shulker.teleport "+playerName)
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~ ~ ~-2 air 0 execute @s ~ ~ ~ detect ~ ~1 ~-2 air 0 tp @s ~ ~ ~-2")
	}
	else if(playerYaw > -135 &&  playerYaw < -45)
	{
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~2 ~ ~ air 0 execute @s ~ ~ ~ detect ~2 ~1 ~ air 0 playsound mob.shulker.teleport "+playerName)
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~2 ~ ~ air 0 execute @s ~ ~ ~ detect ~2 ~1 ~ air 0 tp @s ~2 ~ ~")
	}
	else if(playerYaw >= -45 && playerYaw <= 45)
	{
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~ ~ ~2 air 0 execute @s ~ ~ ~ detect ~ ~1 ~2 air 0 playsound mob.shulker.teleport "+playerName)
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~ ~ ~2 air 0 execute @s ~ ~ ~ detect ~ ~1 ~2 air 0 tp @s ~ ~ ~2")
	}
	else
	{
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~-2 ~ ~ air 0 execute @s ~ ~ ~ detect ~-2 ~1 ~ air 0 playsound mob.shulker.teleport "+playerName)
		this.runCommand("execute "+playerName+" ~ ~ ~ detect ~-2 ~ ~ air 0 execute @s ~ ~ ~ detect ~-2 ~1 ~ air 0 tp @s ~-2 ~ ~")
	}
}
