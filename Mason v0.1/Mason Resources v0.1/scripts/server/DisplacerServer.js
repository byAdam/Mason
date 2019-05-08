var system = server.registerSystem(0,0);
var eventName = "mason:displacerUse"
var primaryClient = false
var tickingAreaIds = []

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));
	this.listenForEvent("mason:displacerHold", (event) => this.itemHold(event));

	this.registerComponent("mason:displacer_data", {position:false,block:false});
};

system.update = function() {
	ids = Object.keys(tickingAreaIds)
	toDelete =[]

	for(i=0;i<ids.length;i++)
	{
		cloneData = tickingAreaIds[ids[i]]
		if(cloneData.ready==0)
		{
			positionA = cloneData.positionA
			positionB = cloneData.positionB

			aX = positionA.x
			aY = positionA.y
			aZ = positionA.z
			bX = positionB.x
			bY = positionB.y
			bZ = positionB.z

			this.runCommand("clone "+aX+" "+aY+" "+aZ+" "+aX+" "+aY+" "+aZ+" "+aX+" 0 "+aZ+" replace move")
			this.runCommand("clone "+bX+" "+bY+" "+bZ+" "+bX+" "+bY+" "+bZ+" "+aX+" "+aY+" "+aZ+" replace move")
			this.runCommand("clone "+aX+" 0 "+aZ+" "+aX+" 0 "+aZ+" "+bX+" "+bY+" "+bZ+" replace move")
			this.runCommand("setblock "+aX+" 0 "+aZ+" bedrock")
			this.runCommand("playsound mob.shulker.teleport "+playerName)
			this.runCommand("tickingarea remove "+areaName)
			this.runCommand("tickingarea remove "+ids[i])

			delete tickingAreaIds[ids[i]];
		}
		else if(cloneData.ready==1)
		{
			cloneData.ready=0
		}
	}

}

system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "interact"
	event.data.item = "mason:displacer"
	event.data.eventName = eventName
	event.data.returns = ["tickingArea","playerName","blockData"]

	this.broadcastEvent("mason:registerTool",event)

	event.data.type = "hold"
	event.data.eventName = "mason:displacerHold"
	event.data.returns = ["playerName"]
	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}

	this.createComponent(event.data.player, "mason:displacer_data")
}

system.itemUse = function(event) {
	if(event.data.isBlacklisted){return}

	blockPosition = event.data.position
	blockData = event.data.blockData
	dataValue = event.data.dataValue
	player = event.data.player
	playerName = event.data.playerName

	// displacer Data
	displacerComponent = this.getComponent(player,"mason:displacer_data")
	displacerData = displacerComponent.data

	// If block saved to displacer Data
	if(displacerData.block)
	{	
		randomInt = Math.floor(Math.random() * 1024);
		bX = displacerData.position.x
		bY = displacerData.position.y
		bZ = displacerData.position.z

		areaName = "mason_"+randomInt
		tickingAreaCommand = "tickingarea add "+bX+" "+bY+" "+bZ+" "+bX+" "+bY+" "+bZ+" "+areaName
		this.executeCommand(tickingAreaCommand,(e) => this.tickingAreaCallback(e,areaName))
		tickingAreaIds["mason_"+randomInt] = {ready:2,positionA:blockPosition,positionB:displacerData.position}
		displacerData.block = false
		displacerData.position = false
	}
	else
	{
		displacerData.block = blockData.__identifier__
		displacerData.position = blockPosition

		splitBlock = blockData.__identifier__.split(":")[1]
		message = "§2"+splitBlock+" @ "+blockPosition.x+","+blockPosition.y+","+blockPosition.z
		this.runCommand("title "+playerName+" actionbar "+message)
		this.runCommand("/playsound note.pling "+playerName)
	}
	this.applyComponentChanges(player,displacerComponent)
}

system.tickingAreaCallback = function(e,areaName)
{
	tickingAreaIds[areaName].ready=1
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}

system.itemHold = function(event) {
	playerName = event.data.playerName
	isHolding = event.data.isHolding

	if(isHolding)
	{
		displacerData = this.getComponent(event.data.player,"mason:displacer_data").data
		if(displacerData.block)
		{
			splitBlock = displacerData.block.split(":")[1]
			message = "§2"+splitBlock+" @ "+displacerData.position.x+","+displacerData.position.y+","+displacerData.position.z
			this.runCommand("title "+playerName+" actionbar "+message)
		}

	}
	else
	{
		this.runCommand("title "+playerName+" actionbar §r")
	}
}