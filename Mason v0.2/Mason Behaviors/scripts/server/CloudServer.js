var system = server.registerSystem(0,0);
var eventName = "mason:cloudUse"
var primaryClient = false
var players = []

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));

};

system.sneakingCallback = function(event)
{
	result = event.data.result
}

system.update = function()
{
	if(players.length>0)
	{
		for(p=0;p<players.length;p++)
		{	
			player = players[p]
			cloudItem = this.getComponent(player[0],"minecraft:hand_container").data[0]
			if(cloudItem.count>0)
			{
				this.executeCommand("execute "+player[1]+" ~ ~1.62001 ~ fill ^ ^ ^3 ^ ^ ^3 cloud 0 replace air",(e) => this.setBlockCallback(e))
			}
		}
	}
}

system.setBlockCallback = function(e)
{
	if(e.data.statusCode==0)
	{
		playerName = e.command.split(" ")[1]

		clearData = this.createEventData("minecraft:execute_command")
		clearData.data.command = "clear "+playerName+" cloud 0 1"
		this.broadcastEvent("minecraft:execute_command",clearData)
	}

}


system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "hold"
	event.data.item = "tile.mason:cloud"
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
	player = event.data.player
	playerName = event.data.playerName
	isHolding = event.data.isHolding

	if(isHolding)
	{
		for(i=0;i<players.length;i++)
		{
			if(players[i][1] == playerName)
			{
				return
			}
		}
		players.push([player,playerName])
	}

	else
	{
		for(i=0;i<players.length;i++)
		{
			if(players[i][1] == playerName)
			{
				players.splice(i, 1);
			}
		}
	}
}
