var system = server.registerSystem(0,0);

system.update = function() {
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = "execute @a ~ ~ ~ detect ~ ~-.1 ~ elevator -1 /playsound beacon.deactivate @s ~ ~ ~ 1 3.5"
	this.broadcastEvent("minecraft:execute_command",eventData)	

	eventData.data.command = "execute @a ~ ~ ~ detect ~ ~-.1 ~ elevator -1 effect @s levitation 1 48 true"
	this.broadcastEvent("minecraft:execute_command",eventData)
}