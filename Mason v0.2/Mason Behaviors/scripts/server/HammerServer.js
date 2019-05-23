var system = server.registerSystem(0,0);
var eventName = "mason:hammerUse"
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
	event.data.type = "destroy"
	event.data.item = "mason:hammer"
	event.data.eventName = eventName
	event.data.returns = ["blockData","playerName","dataValue"]
	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}
}

system.itemUse = function(event) {
	identifier = event.data.blockData.split(":")[1]
	dataValue = event.data.dataValue
	blockPosition = event.data.position
	player = event.data.player
	playerName = event.data.playerName
	item = event.data.item

	startStopArray = [-1,1,-1,1,-1,1]
	this.destroyBlocks(startStopArray,blockPosition,playerName,identifier,dataValue)
}

system.destroyBlocks = function(startStopArray,position,playerName,identifier,dataValue)
{
	setBlockData = this.createEventData("minecraft:execute_command")

	//[minX,maxX,minY,maxY,minZ,maxZ]
	for(x=startStopArray[0];x<startStopArray[1]+1;x++)
	{
		for(y=startStopArray[2];y<startStopArray[3]+1;y++)
		{
			for(z=startStopArray[4];z<startStopArray[5]+1;z++)
			{
				setBlockData.data.command = "execute "+playerName+" "+(x+position.x)+" "+(y+position.y)+" "+(z+position.z)+" detect ~ ~ ~ "+identifier+" "+dataValue+" setblock ~ ~ ~ air 0 destroy"
				this.broadcastEvent("minecraft:execute_command",setBlockData)
			}
		}
	}
}