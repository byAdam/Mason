var system = server.registerSystem(0,0);
var eventName = "mason:screwdriverUse"
var primaryClient = false

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));
	this.listenForEvent("mason:screwdriverHold", (event) => this.itemHold(event));

	this.registerComponent("mason:screwdriver_data", {block:false,position:false,dataValue:false});
};

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "interact"
	event.data.item = "mason:screwdriver"
	event.data.eventName = eventName
	event.data.returns = ["tickingArea","playerName","blockData","dataValue"]

	this.broadcastEvent("mason:registerTool",event)

	event.data.type = "hold"
	event.data.eventName = "mason:screwdriverHold"
	event.data.returns = ["playerName"]
	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}

	this.createComponent(event.data.player, "mason:screwdriver_data")
}

system.itemUse = function(event) {
	if(event.data.isBlacklisted){return}

	blockPosition = event.data.position
	blockData = event.data.blockData
	dataValue = event.data.dataValue
	tickingArea = event.data.tickingArea
	player = event.data.player
	playerName = event.data.playerName

	// screwdriver Data
	screwdriverComponent = this.getComponent(player,"mason:screwdriver_data")
	screwdriverData = screwdriverComponent.data

	// If block saved to screwdriver Data
	if(screwdriverData.block)
	{
		this.screwdriverFill(player,playerName,tickingArea,screwdriverData.block,screwdriverData.dataValue,screwdriverData.position,blockPosition)
		screwdriverData.block = false
		screwdriverData.dataValue = false
		screwdriverData.position = false
	}
	else
	{
		screwdriverData.block = blockData.__identifier__
		screwdriverData.position = blockPosition
		screwdriverData.dataValue = dataValue

		splitBlock = blockData.__identifier__.split(":")[1]
		message = "§2"+splitBlock+" @ "+blockPosition.x+","+blockPosition.y+","+blockPosition.z
		this.runCommand("title "+playerName+" actionbar "+message)
		this.runCommand("/playsound note.pling "+playerName)
	}
	this.applyComponentChanges(player,screwdriverComponent)
}

system.screwdriverFill = function(player,playerName,tickingArea,block,dataValue,positionA,positionB) {
	areaCount = 0
	totalCount = 0

	// Get blocks in area
	minPosition = {x:Math.min(positionA.x,positionB.x),y:Math.min(positionA.y,positionB.y),z:Math.min(positionA.z,positionB.z)}
	maxPosition = {x:Math.max(positionA.x,positionB.x),y:Math.max(positionA.y,positionB.y),z:Math.max(positionA.z,positionB.z)}

	totalCount = (maxPosition.x-minPosition.x)*(maxPosition.y-minPosition.y)*(maxPosition.z-minPosition.z)

	if(totalCount>256)
	{
		message = "§4Too many blocks in area ("+totalCount+">256)"
		this.runCommand("title "+playerName+" actionbar "+message)
		this.runCommand("/playsound note.bass "+playerName)
		return
	}

	blocks = this.getBlocks(tickingArea, minPosition,maxPosition)

	// Count air blocks
	for(x=0;x<blocks.length;x++)
	{
		for(y=0;y<blocks[x].length;y++)
		{
			for(z=0;z<blocks[x][y].length;z++)
			{
				if(blocks[x][y][z].__identifier__ == "minecraft:air")
				{
					areaCount++
				}
			}
		}
	}

	if(areaCount==0)
	{
		this.runCommand("/playsound note.bass "+playerName)
		return
	}

	inventoryCount = this.countBlockInInventory(player,block)
	if(inventoryCount>=areaCount)
	{	
		// Remove namespace
		block = block.split(":")[1]

		//Fill
		this.runCommand("fill "+minPosition.x+" "+minPosition.y+" "+minPosition.z+" "+maxPosition.x+" "+maxPosition.y+" "+maxPosition.z+" "+block+" "+dataValue+" replace air")
		this.runCommand("/playsound note.pling "+playerName)

		//Clear
		// Change from -1 once item api has improved
		this.runCommand("clear "+playerName+" "+block+" -1 "+areaCount)
	}
	else
	{
		// Send error message
		blocksShort = areaCount-inventoryCount
		message = "§4You need "+blocksShort+" more blocks"
		this.runCommand("title "+playerName+" actionbar "+message)
		this.runCommand("/playsound note.bass "+playerName)
	}
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}


system.countBlockInInventory = function(player,block) {
	count = 0
	inventoryContainer = this.getComponent(player,"minecraft:inventory_container")
	hotbarContainer = this.getComponent(player,"minecraft:hotbar_container")
	inventory = inventoryContainer.data.concat(hotbarContainer.data)

	for(i=0;i<inventory.length;i++)
	{
		stack = inventory[i]
		identifier = stack.__identifier__ 

		//Exceptions
		identifier = identifier.replace("double_stone_slab", "stone_slab")

		if(identifier == block)
		{
			count+=(stack.count)
		}
	}

	return count
}

system.itemHold = function(event) {
	playerName = event.data.playerName
	isHolding = event.data.isHolding

	if(isHolding)
	{
		screwdriverData = this.getComponent(event.data.player,"mason:screwdriver_data").data
		if(screwdriverData.block)
		{
			splitBlock = screwdriverData.block.split(":")[1]
			message = "§2"+splitBlock+" @ "+screwdriverData.position.x+","+screwdriverData.position.y+","+screwdriverData.position.z
			this.runCommand("title "+playerName+" actionbar "+message)
		}

	}
	else
	{
		this.runCommand("title "+playerName+" actionbar §r")
	}
}