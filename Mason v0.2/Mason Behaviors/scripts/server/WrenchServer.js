var system = server.registerSystem(0,0);
var eventName = "mason:wrenchUse"
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
	event.data.type = "interact"
	event.data.item = "mason:wrench"
	event.data.eventName = eventName
	event.data.returns = ["tickingArea","blockData","playerName"]

	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
	}
}

system.setBlock = function(position,blockData,dataValue)
{
	identifier = blockData.__identifier__.split(":")[1]
	this.runCommand("setblock "+position.x+" "+position.y+" "+position.z+" "+identifier+" "+dataValue)
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}

system.itemUse = function(event) {

	blockPosition = event.data.position
	blockData = event.data.blockData
	dataValue = event.data.dataValue
	playerName = event.data.playerName

	whitelist = {}
	whitelist.direction6 = ["minecraft:piston","minecraft:sticky_piston","minecraft:observer"]
	whitelist.direction4 = ["minecraft:carved_pumpkin","minecraft:lit_pumpkin"]
	whitelist.rails = ["minecraft:golden_rail","minecraft:detector_rail","minecraft:rail","minecraft:activator_rail"]
	whitelist.stairs = ["minecraft:stone_stairs","minecraft:nether_brick_stairs","minecraft:brick_stairs","minecraft:oak_stairs","minecraft:purpur_stairs","minecraft:red_nether_brick_stairs","minecraft:sandstone_stairs","minecraft:spruce_stairs","minecraft:birch_stairs","minecraft:jungle_stairs","minecraft:acacia_stairs","minecraft:dark_oak_stairs","minecraft:red_sandstone_stairs","minecraft:prismarine_stairs","minecraft:dark_prismarine_stairs","minecraft:prismarine_bricks_stairs","minecraft:granite_stairs","minecraft:diorite_stairs","minecraft:andesite_stairs","minecraft:polished_granite_stairs","minecraft:polished_diorite_stairs","minecraft:polished_andesite_stairs","minecraft:mossy_stone_brick_stairs","minecraft:smooth_red_sandstone_stairs","minecraft:smooth_sandstone_stairs","minecraft:end_brick_stairs","minecraft:mossy_cobblestone_stairs","minecraft:normal_stone_stairs"]
	whitelist.logs = ["minecraft:log","minecraft:log2"]
	whitelist.striped_logs = ["minecraft:stripped_spruce_log","minecraft:stripped_birch_log","minecraft:stripped_jungle_log","minecraft:stripped_acacia_log","minecraft:stripped_dark_oak_log","minecraft:stripped_oak_log"]

	types = Object.keys(whitelist)
	for(w=0;w<types.length;w++)
	{
		type = types[w]
		identifiers = whitelist[type]
		if(identifiers.indexOf(blockData.__identifier__)>-1)
		{
			switch(type)
			{
				case "direction6":
					dataValue++
					if(dataValue>=6){dataValue = 0}
					break
				case "direction4":
					dataValue++
					if(dataValue>=4){dataValue = 0}
					break
				case "rails":
					dataValue++
					if(dataValue>=10){dataValue = 0}
					break
				case "stairs":
					dataValue++
					if(dataValue>=8){dataValue = 0}
					break
				case "logs":
					dataValue+=4
					if(dataValue>=16){dataValue-=16}
					break
				case "striped_logs":
					dataValue++
					if(dataValue>=4){dataValue = 0}
					break
			}
			this.setBlock(blockPosition,blockData,dataValue)
			this.runCommand("/playsound note.snare "+playerName)
			return
		}
	}
}
