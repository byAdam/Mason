var system = server.registerSystem(0,0);
var eventName = "mason:cloudUse"
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
	event.data.item = "mason:cloud_item"
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

system.setBlockCallback = function(event,count)
{
	if(event.data.statusCode!=0)
	{
		this.runCommand("/replaceitem entity "+playerName+" slot.weapon.mainhand 0 cloud_item "+count)
	}
}

system.itemUse = function(event) 
{
	playerName = event.data.playerName
	count = event.data.count

	this.executeCommand("execute "+playerName+" ~ ~1.62001 ~ fill ^ ^ ^3 ^ ^ ^3 cloud 0 replace air",(e) => this.setBlockCallback(e,count))
}
