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

system.updateState = function(blockType,blockState,identifier)
{
	if(blockType=="stairs")
	{
		blockState.weirdo_direction += 1
		if(blockState.weirdo_direction==4)
		{
			blockState.weirdo_direction = 0
			blockState.upside_down_bit = !blockState.upside_down_bit
		}
	}
	else if(blockType=="direction6")
	{
		blockState.facing_direction += 1
		if(blockState.facing_direction==6)
		{
			blockState.facing_direction = 0
		}
	}
	else if(blockType=="direction4Face")
	{
		blockState.facing_direction += 1
		if(blockState.facing_direction==6)
		{
			blockState.facing_direction = 2
		}
	}
	else if(blockType=="direction4" || (blockType=="pillars" && blockState.chisel_type=="lines"))
	{
		blockState.direction += 1
		if(blockState.direction==4)
		{
			blockState.direction=0
		}
	}
	else if(blockType=="rails")
	{
		blockState.rail_direction += 1
		if(blockState.rail_direction==10)
		{
			blockState.rail_direction=0
		}
	}
	else if(blockType=="trapdoors")
	{
		blockState.direction += 1
		if(blockState.direction==4)
		{
			blockState.direction = 0
			blockState.upside_down_bit = !blockState.upside_down_bit
		}
	}

	return blockState
}

system.itemUse = function(event) {

	blockPosition = event.data.position
	blockData = event.data.blockData
	identifier = blockData.__identifier__
	playerName = event.data.playerName

	whitelist = {}
	whitelist.direction6 = ["minecraft:piston","minecraft:sticky_piston","minecraft:observer","minecraft:dropper","minecraft:dispenser"]
	whitelist.direction4Face = ["minecraft:chest","minecraft:furnace","minecraft:blast_furnace","minecraft:lit_furnace","minecraft:trapped_chest","minecraft:black_glazed_terracotta","minecraft:blue_glazed_terracotta","minecraft:brown_glazed_terracotta","minecraft:cyan_glazed_terracotta","minecraft:gray_glazed_terracotta","minecraft:green_glazed_terracotta","minecraft:light_blue_glazed_terracotta","minecraft:lime_blue_glazed_terracotta","minecraft:magenta_glazed_terracotta","minecraft:orange_glazed_terracotta","minecraft:pink_glazed_terracotta","minecraft:purple_glazed_terracotta","minecraft:red_glazed_terracotta","minecraft:silver_glazed_terracotta","minecraft:white_glazed_terracotta","minecraft:yellow_glazed_terracotta"]
	whitelist.stairs = ["minecraft:stone_stairs","minecraft:nether_brick_stairs","minecraft:brick_stairs","minecraft:oak_stairs","minecraft:purpur_stairs","minecraft:red_nether_brick_stairs","minecraft:sandstone_stairs","minecraft:spruce_stairs","minecraft:birch_stairs","minecraft:jungle_stairs","minecraft:acacia_stairs","minecraft:dark_oak_stairs","minecraft:red_sandstone_stairs","minecraft:prismarine_stairs","minecraft:dark_prismarine_stairs","minecraft:prismarine_bricks_stairs","minecraft:granite_stairs","minecraft:diorite_stairs","minecraft:andesite_stairs","minecraft:polished_granite_stairs","minecraft:polished_diorite_stairs","minecraft:polished_andesite_stairs","minecraft:mossy_stone_brick_stairs","minecraft:smooth_red_sandstone_stairs","minecraft:smooth_sandstone_stairs","minecraft:end_brick_stairs","minecraft:mossy_cobblestone_stairs","minecraft:normal_stone_stairs"]
	whitelist.direction4 = ["minecraft:lectern","minecraft:carved_pumpkin","minecraft:lit_pumpkin","minecraft:log","minecraft:log2","minecraft:stripped_spruce_log","minecraft:stripped_birch_log","minecraft:stripped_jungle_log","minecraft:stripped_acacia_log","minecraft:stripped_dark_oak_log","minecraft:stripped_oak_log","minecraft:fence_gate","minecraft:acacia_fence_gate","minecraft:birch_fence_gate","minecraft:dark_oak_fence_gate","minecraft:jungle_fence_gate","minecraft:spruce_fence_gate","minecraft:hay_block"]
	whitelist.rails = ["minecraft:golden_rail","minecraft:detector_rail","minecraft:rail","minecraft:activator_rail"]
	whitelist.trapdoors = ["minecraft:trapdoor","minecraft:acacia_trapdoor","minecraft:birch_trapdoor","minecraft:dark_oak_trapdoor","minecraft:iron_trapdoor","minecraft:jungle_trapdoor","minecraft:spruce_trapdoor"]
	whitelist.pillars = ["minecraft:purpur_block","minecraft:quartz_block"]

	whitelistKeys = Object.keys(whitelist)

	blockStateComponent = this.getComponent(blockData, "minecraft:blockstate")
	blockType = false
	for(w=0;w<whitelistKeys.length;w++)
	{
		currentType = whitelistKeys[w]
		if(whitelist[currentType].indexOf(identifier)>-1)
		{
			blockType = currentType
			break
		}
	}
	if(!blockType){return}

	blockStateComponent.data = this.updateState(blockType,blockStateComponent.data,identifier)

	this.applyComponentChanges(blockData,blockStateComponent)
	this.runCommand("/playsound note.snare "+playerName)
}