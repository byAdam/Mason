var system = server.registerSystem(0,0);
var primaryClient = false

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent("mason:ploughClick", (event) => this.itemUse(event));
	this.listenForEvent("mason:ploughDestroy", (event) => this.ploughDestroy(event));
};

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.item = "mason:plough"
	event.data.eventName = "mason:ploughClick"
	event.data.type = "interact"
	event.data.returns = ["blockData","dataValue","playerName"]

	this.broadcastEvent("mason:registerTool",event)

	event.data.type = "destroy"
	event.data.eventName = "mason:ploughDestroy"
	event.data.returns = ["blockData","playerName"]

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
	this.runCommand("fill "+(position.x-2)+" "+(position.y-1)+" "+(position.z-2)+" "+(position.x+2)+" "+(position.y+1)+" "+(position.z+2)+" farmland 2 replace grass")
	this.runCommand("fill "+(position.x-2)+" "+(position.y-1)+" "+(position.z-2)+" "+(position.x+2)+" "+(position.y+1)+" "+(position.z+2)+" farmland 2 replace dirt 0")
	this.runCommand("execute "+playerName+" ~ ~ ~ playsound use.gravel @s ~ ~ ~ 1 0.8")
}


system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}


system.ploughDestroy = function(event)
{
	blockData = event.data.blockData.split(":")[1]
	position = event.data.position

	whitelist = ["wheat","beetroot","carrots","potatoes"]

	if(whitelist.indexOf(blockData)>-1)
	{
		for(x=-2;x<3;x++)
		{
			for(z=-2;z<3;z++)
			{
				this.runCommand("execute @p "+(position.x+x)+" "+position.y+" "+(position.z+z)+" detect ~ ~ ~ "+blockData+" 7 setblock ~ ~ ~ air 0 destroy")
			}
		}
		
	}
}