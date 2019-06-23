var system = server.registerSystem(0,0);
var firstTick = true

system.update = function() {
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = "function breaker"
	this.broadcastEvent("minecraft:execute_command",eventData)
}