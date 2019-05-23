var system = client.registerSystem(0,0);
var clientPlayer;

system.initialize = function () {
	this.listenForEvent("minecraft:client_entered_world", (event) => this.onJoin(event));
	this.registerEventData("mason:playerJoin", {})

	this.registerEventData("mason:registerTool",{})
	this.registerEventData("mason:requestTool",{})

	this.listenForEvent("mason:registerTool", (event) => this.registerTool(event));
	this.listenForEvent("mason:requestTool", (event) => this.requestTool(event));
	this.listenForEvent("mason:useTool", (event) => this.useTool(event));
	this.listenForEvent("mason:molangQuery", (event) => this.molangQuery(event));

};

system.onJoin = function (player) {

	clientPlayer = player.data.player

    eventData = this.createEventData("mason:playerJoin")
	eventData.data = {}
	eventData.data.player = clientPlayer
	this.broadcastEvent("mason:playerJoin",eventData)
};

system.registerTool = function (event)
{
	if(event.data.player.id==clientPlayer.id)
	{
			this.broadcastEvent("mason:registerTool",event)
	}
}

system.requestTool = function (event)
{
	if(event.data.player.id==clientPlayer.id)
	{
			this.broadcastEvent("mason:requestTool",event)
	}
}

system.useTool = function (event)
{
	if(event.data.player.id==clientPlayer.id)
	{
		eventName = event.data.eventName

		eventData = this.createEventData(eventName)
		if(!eventData)
		{
			this.registerEventData(eventName,{})
			eventData = this.createEventData(eventName)
		}
		
		eventData.data = event.data
		this.broadcastEvent(eventName,eventData)
	}
}

system.molangQuery = function (event)
{
	if(event.data.player.id==clientPlayer.id)
	{
		molangComponent = this.getComponent(clientPlayer,"minecraft:molang")

		eventName = event.data.eventName
		returnData = this.createEventData(eventName)
		if(!returnData)
		{
			this.registerEventData(eventName,{})
			returnData = this.createEventData(eventName)
		}

		returnData.data = {}
		returnData.data.player = clientPlayer
		returnData.data.query = event.data.query
		returnData.data.result = molangComponent[event.data.query]

		this.broadcastEvent(eventName,returnData)
	}
}