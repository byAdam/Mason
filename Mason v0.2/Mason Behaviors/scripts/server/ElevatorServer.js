var system = server.registerSystem(0,0);

system.update = function() {
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = "function elevator"
	this.broadcastEvent("minecraft:execute_command",eventData)
}