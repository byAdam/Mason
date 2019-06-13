var system = server.registerSystem(0,0);
var firstTick = true

system.update = function() {
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = "function butcher"
	this.broadcastEvent("minecraft:execute_command",eventData)	


	if(firstTick)
	{
		eventData = this.createEventData("minecraft:execute_command")
		eventData.data.command = "scoreboard objectives add MasonButcherTick dummy"
		this.broadcastEvent("minecraft:execute_command",eventData)
	}


	firstTick = false
}