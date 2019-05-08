var system = server.registerSystem(0,0);
var eventName = "mason:chainsawUse"
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
	event.data.item = "mason:chainsaw"
	event.data.eventName = eventName
	event.data.returns = ["blockData","tickingArea"]
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
	blockPosition = event.data.position
	tickingArea = event.data.tickingArea

	if(identifier == "log" || identifier == "log2")
	{
		this.checkAroundLog(tickingArea,blockPosition)
	}
}

system.checkAroundLog = function(tickingArea,blockPosition)
{
	blocks = this.getBlocks(tickingArea,blockPosition.x-1,blockPosition.y-1,blockPosition.z-1,blockPosition.x+1,blockPosition.y+1,blockPosition.z+1)
	setBlockData = this.createEventData("minecraft:execute_command")

	logBlocks = []
	for(x=0;x<blocks.length;x++)
	{
		for(y=0;y<blocks[x].length;y++)
		{
			for(z=0;z<blocks[x][y].length;z++)
			{
				block = blocks[x][y][z]
				identifier = block.__identifier__
				if(identifier=="minecraft:log" || identifier == "minecraft:log2")
				{
					logBlocks.push(block)
				}
			}
		}
	}

	for(b=0;b<logBlocks.length;b++)
	{
		block = logBlocks[b]
		blockPos = block.block_position
		if(blockPos.x == blockPosition.x && blockPos.y == blockPosition.y && blockPos.z == blockPosition.z){continue}
		setBlockData.data.command =  "setblock "+blockPos.x+" "+blockPos.y+" "+blockPos.z+" air 0 destroy"
		this.broadcastEvent("minecraft:execute_command",setBlockData)
		this.checkAroundLog(tickingArea,blockPos)
	}

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