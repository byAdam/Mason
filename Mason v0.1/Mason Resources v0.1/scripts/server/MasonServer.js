var system = server.registerSystem(0,0);
var blacklist = ["minecraft:acacia_button","minecraft:acacia_door","minecraft:acacia_fence_gate","minecraft:acacia_pressure_plate","minecraft:acacia_wall_sign","minecraft:acacia_standing_sign","minecraft:spruce_button","minecraft:spruce_door","minecraft:spruce_fence_gate","minecraft:spruce_pressure_plate","minecraft:spruce_wall_sign","minecraft:spruce_standing_sign","minecraft:dark_oak_button","minecraft:dark_oak_door","minecraft:dark_oak_fence_gate","minecraft:dark_oak_pressure_plate","minecraft:darkoak_wall_sign","minecraft:darkoak_standing_sign","minecraft:oak_button","minecraft:oak_door","minecraft:fence_gate","minecraft:oak_pressure_plate","minecraft:wall_sign","minecraft:standing_sign","minecraft:birch_button","minecraft:birch_door","minecraft:birch_fence_gate","minecraft:birch_pressure_plate","minecraft:birch_wall_sign","minecraft:birch_standing_sign","minecraft:jungle_button","minecraft:jungle_door","minecraft:jungle_fence_gate","minecraft:jungle_pressure_plate","minecraft:jungle_wall_sign","minecraft:jungle_standing_sign","minecraft:activator_rail","minecraft:bamboo","minecraft:bamboo_sapling","minecraft:bed","minecraft:beetroot","minecraft:bubble_column","minecraft:cake","minecraft:cactus","minecraft:carrot","minecraft:campfire","minecraft:deadbush","minecraft:detector_rail","minecraft:double_plant","minecraft:dragon_egg","minecraft:end_rod","minecraft:end_portal","minecraft:end_portal_frame","minecraft:fire","minecraft:flower_pot","minecraft:flowing_lava","minecraft:flowing_water","minecraft:frame","minecraft:golden_rail","minecraft:grindstone","minecraft:heavy_weighted_pressure_plate","minecraft:iron_door","minecraft:kelp","minecraft:ladder","minecraft:lantern","minecraft:lava","minecraft:lectern","minecraft:lever","minecraft:light_weighted_pressure_plate","minecraft:melon_stem","minecraft:mob_spawner","minecraft:nether_wart","minecraft:pistonarmcollision","minecraft:portal","minecraft:powered_comparator","minecraft:powered_repeater","minecraft:potatoes","minecraft:pumpkin_stem","minecraft:rail","minecraft:redstone_torch","minecraft:redstone_wire","minecraft:red_flower","minecraft:red_mushroom","minecraft:redstone_wire","minecraft:reeds","minecraft:sapling","minecraft:sea_pickle","minecraft:seagrass","minecraft:snow_layer","minecraft:standing_banner","minecraft:sweet_berry_bush","minecraft:tallgrass","minecraft:torch","minecraft:tripwire","minecraft:tripwire_hook","minecraft:turtle_egg","minecraft:unlit_redstone_torch","minecraft:unpowered_comparator","minecraft:unpowered_repeater","minecraft:vine","minecraft:wall_banner","minecraft:water","minecraft:waterlily","minecraft:wheat","minecraft:yellow_flower","minecraft:bedrock"]
var tools = {"interact":[],"destroy":[],"hold":[],"place":[]}
var primaryClient = false;

system.initialize = function() {		
	this.registerEventData("mason:registerTool",{})
	this.registerEventData("mason:requestTool",{})
	this.registerEventData("mason:useTool",{})
	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("minecraft:block_interacted_with", (event) => this.blockInteract(event,"interact"));
	this.listenForEvent("minecraft:player_destroyed_block", (event) => this.blockInteract(event,"destroy"));
	this.listenForEvent("minecraft:player_placed_block", (event) => this.blockInteract(event,"place"));
	this.listenForEvent("minecraft:entity_carried_item_changed", (event) => this.holdChange(event));

	this.listenForEvent("mason:registerTool", (event) => this.registerTool(event));
};

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
		requestEvent = this.createEventData("mason:registerTool")
		requestEvent.data = {player:primaryClient}
		this.broadcastEvent("mason:requestTool",requestEvent);
	}
}

system.registerTool = function(event) {
	// Add tool to list
	tool = {item:false,block:false}
	tool.item = event.data.item
	tool.block = event.data.block
	tool.eventName = event.data.eventName
	tool.returns = event.data.returns
	tools[event.data.type].push(tool)
	// Register Event Data if not already registered
	if(!this.createEventData(tool.eventName))
	{
		this.registerEventData(tool.eventName,{})
	}
}

system.getTickingArea = function(player) {
	tickWorldComponent = this.getComponent(player,"minecraft:tick_world")
	return tickWorldComponent.data.ticking_area
}

system.getHoldingItem = function(player,isPrimary=true) {
	handContainer = this.getComponent(player,"minecraft:hand_container")
	if(isPrimary)
	{
		return handContainer.data[0].item
	}
	else
	{
		return handContainer.data[1].item
	}	
}

system.getPlayerName = function(player) {
	nameable = this.getComponent(player,"minecraft:nameable")
	return nameable.data.name
}

system.sendActionMessage = function(player,message) {	
	actionData = this.createEventData("minecraft:execute_command")
	playerName = this.getPlayerName(player)
	actionData.data.command = "title "+playerName+" actionbar "+message
	this.broadcastEvent("minecraft:execute_command",actionData)
}

system.getDataValue = function(blockData) {
	blockState = this.getComponent(blockData, "minecraft:blockstate").data

	convertDict = {additions:{direction:4,top_slot_bit:8,upside_down_bit:4}}
	convertDict.color = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "silver", "cyan", "purple", "blue", "brown", "green", "red","black"]
	convertDict.wood_type = ["oak", "spruce", "birch", "jungle", "acacia", "dark_oak"]
	convertDict.stone_type = ["stone", "granite", "granite_smooth", "diorite", "diorite_smooth", "andesite", "andesite_smooth"]
	convertDict.dirt_type = ["normal", "coarse"]
	convertDict.sand_type = ["normal", "red"]
	convertDict.old_log_type = ["oak", "spruce", "birch", "jungle"]
	convertDict.new_log_type = ["acacia", "dark_oak"]	
	convertDict.old_leaf_type = ["oak", "spruce", "birch", "jungle"]
	convertDict.new_leaf_type = ["acacia", "dark_oak"]
	convertDict.chisel_type = ["default", "chiseled", "lines", "smooth"]
	convertDict.sponge_type = ["dry", "wet"]
	convertDict.sand_stone_type = ["default", "heiroglyphs", "cut", "smooth"]
	convertDict.stone_stone_type = ["default", "mossy", "cracked", "chiseled", "smooth"]
	convertDict.stone_slab_type = ["smooth_stone", "sandstone", "wood", "cobblestone", "brick", "stone_brick", "quartz", "nether_brick"]
	convertDict.stone_slab_type2 = ["red_sandstone", "purpur", "prismarine_rough", "prismarine_dark", "prismarine_brick", "mossy_cobblestone", "smooth_sandstone", "red_nether_brick"]
	convertDict.stone_slab_type3 = ["end_stone_brick", "smooth_red_sandstone", "polishe_andesite", "andesite", "diorite", "polished_diorite", "granite", "polished_granite"]
	convertDict.stone_slab_type4 = ["mossy_stone_brick", "smooth_quartz", "stone", "cut_sandstone", "cut_red_sandstone"]
	// False means just use the state value
	convertDict.weirdo_direction = false
	convertDict.facing_direction = false
	convertDict.huge_mushroom_bits = false
	convertDict.rail_direction = false


	if(blockState)
	{
		additions = 0
		dataValue = 0
		states = Object.keys(blockState)
		for(k=0;k<states.length;k++)
		{
			state = states[k]
			stateValue = blockState[state]
			if(state in convertDict)
			{
				convertArray = convertDict[state]
				// For when you just want to use the stateValue
				if(convertArray===false)
				{
					dataValue = stateValue
				}
				else
				{	
					index = convertArray.indexOf(stateValue)
					//Not in array if -1
					if(index>-1){dataValue = index}
				}
			}
			// For situations such as logs and slabs
			else if(state in convertDict.additions)
			{	
				// Work around for the fact sometimes "direction" is the only property
				if(state == "direction" && states.length==1){
					dataValue=stateValue
					continue
				}

				additions = stateValue*convertDict.additions[state]	
			}

		}
		return dataValue+additions
	}
	else
	{
		return 0
	}
}

system.blockInteract = function(event,interactType) {
	position = event.data.block_position
	player = event.data.player

	//Ticking Area and block
	tickingArea = this.getTickingArea(player)
	blockData = this.getBlock(tickingArea,position)
	holdingItem = this.getHoldingItem(player)

	for(t=0;t<tools[interactType].length;t++)
	{
		tool = tools[interactType][t]
		if((tool.item==holdingItem || tool.block==blockData.__identifier__))
		{
			//Create Event Data
			toolEvent = this.createEventData(tool.eventName)
			toolEvent.data = {}
			toolEvent.data.player = player
			toolEvent.data.position = position
			toolEvent.data.eventName = tool.eventName
			toolEvent.data.item = tool.item

			// Loop through what the tool wants returned
			for(r=0;r<tool.returns.length;r++)
			{
				switch(tool.returns[r])
				{
					case "tickingArea":
						toolEvent.data.tickingArea = tickingArea
						break
					case "playerName":
						toolEvent.data.playerName = this.getPlayerName(player)
						break
					case "blockData":
						toolEvent.data.blockData = blockData
						toolEvent.data.isBlacklisted=false
						//If block was destroyed
						if(blockData.__identifier__=="minecraft:air"){toolEvent.data.blockData=event.data.block_identifier}
						//Blacklist
						if(blacklist.indexOf(toolEvent.data.blockData.__identifier__)>-1){toolEvent.data.isBlacklisted=true}
					case "dataValue":
						toolEvent.data.dataValue = this.getDataValue(blockData)
				}
			}

			this.broadcastEvent("mason:useTool",toolEvent)
		}
	}
}

system.holdChange = function(event)
{
	player = event.data.entity
	currentItem = event.data.carried_item.item
	previousItem = event.data.previous_carried_item.item

	for(t=0;t<tools["hold"].length;t++)
	{
		tool = tools["hold"][t]
		if(currentItem==tool.item || previousItem==tool.item)
		{
			toolEvent = this.createEventData(tool.eventName)
			toolEvent.data = {}
			toolEvent.data.eventName = tool.eventName
			toolEvent.data.currentItem = currentItem
			toolEvent.data.previousItem = currentItem
			toolEvent.data.player = player

			for(r=0;r<tool.returns.length;r++)
			{
				switch(tool.returns[r])
				{
					case "tickingArea":
						toolEvent.data.tickingArea = tickingArea
						break
					case "playerName":
						toolEvent.data.playerName = this.getPlayerName(player)
						break
				}
			}

			toolEvent.data.isHolding = false
			if(currentItem==tool.item)
			{
				toolEvent.data.isHolding = true
			}

			this.broadcastEvent("mason:useTool",toolEvent)
		}
	}
}