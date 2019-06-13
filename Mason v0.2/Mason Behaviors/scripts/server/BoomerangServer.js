var system = server.registerSystem(0,0);
var eventName = "mason:boomerangUse"
var primaryClient = false
var boomerangs = []
var boomerangQuery  = false

system.initialize = function() {	
	this.listenForEvent("mason:playerJoin", (event) => this.playerJoin(event));
	this.listenForEvent("mason:requestTool", (event) => this.broadcastTool(event));
	this.listenForEvent(eventName, (event) => this.itemUse(event));

	boomerangQuery = this.registerQuery("minecraft:position", "x", "y", "z"); 
};

system.update = function()
{
	this.runCommand("execute @e[type=mason:boomerang,c=1] ~ ~ ~ function boomerang")
	this.processBoomerangs()
}

system.processBoomerangs = function()
{
	for(b=0;b<boomerangs.length;b++)
	{
		boomerang = boomerangs[b]

		this.runCommand("execute @e[type=mason:boomerang,tag="+boomerang.boomerangId+",tag=!MasonBoomerangReturn] ~ ~ ~ tp @s "+boomerang.rayCoordinates+" facing "+boomerang.originCoordinates)
		
		
		positionBoomerangComponent = this.getComponent(boomerang.entity,"minecraft:position")

		if(positionBoomerangComponent==null)
		{
			boomerangs.splice(b,1)
			continue
		}

		if(boomerang.tick%2==0)
		{
			this.runCommand("execute @e[type=mason:boomerang,tag="+boomerang.boomerangId+"] ~ ~ ~ playsound firework.shoot @a ~ ~ ~ 1 0.8")
		}

		if(boomerang.tick%5==0)
		{


			positionDifference = {}
			positionBoomerang = positionBoomerangComponent.data
			positionPlayer = this.getComponent(boomerang.player,"minecraft:position").data

			positionDifference = {}

			positionDifference.x = positionPlayer.x-positionBoomerang.x
			positionDifference.y = parseFloat(positionPlayer.y+1.52001-positionBoomerang.y)
			positionDifference.z = positionPlayer.z-positionBoomerang.z

			unitResolver = Math.sqrt((positionDifference.x*positionDifference.x)+(positionDifference.y*positionDifference.y)+(positionDifference.z*positionDifference.z))

			positionDifference.x = positionDifference.x/unitResolver 
			positionDifference.y = positionDifference.y/unitResolver 
			positionDifference.z = positionDifference.z/unitResolver 

			boomerang.positionDifference = positionDifference
		}

		this.runCommand("execute @e[type=mason:boomerang,tag="+boomerang.boomerangId+",tag=MasonBoomerangReturn] ~ ~ ~ tp @s ~"+positionDifference.x+" ~"+positionDifference.y+" ~"+positionDifference.z+" facing "+boomerang.playerName)

		this.runCommand("execute @e[type=mason:boomerang,tag="+boomerang.boomerangId+",tag=!MasonDie,tag=MasonBoomerangReturn] ~ ~-1.52001 ~ give @a[name="+boomerang.playerName+",r=1] mason:boomerang")
		this.runCommand("execute "+boomerang.playerName+" ~ ~1.52001 ~ tag @e[type=mason:boomerang,tag="+boomerang.boomerangId+",tag=MasonBoomerangReturn,r=1] add MasonDie")

		if(boomerang.tick==30)
		{
			this.runCommand("tag @e[type=mason:boomerang,tag="+boomerang.boomerangId+"] add MasonBoomerangReturn")
		}


		boomerang.tick++
	}
}


system.broadcastTool = function(event) {
	event = this.createEventData("mason:registerTool")
	event.data = {}
	event.data.player = primaryClient
	event.data.type = "use"
	event.data.item = "mason:boomerang"
	event.data.eventName = eventName
	event.data.returns = ["playerName","ray"]

	this.broadcastEvent("mason:registerTool",event)
}

system.playerJoin = function(event) {
	if(!primaryClient)
	{
		primaryClient = event.data.player
		this.runCommand("scoreboard objectives add MasonBoomerangC dummy")
		this.runCommand("effect @e[type=mason:boomerang] invisibility 1 0 true")
		this.runCommand("kill @e[type=mason:boomerang]")
	}
}

system.runCommand = function(command)
{
	eventData = this.createEventData("minecraft:execute_command")
	eventData.data.command = command
	this.broadcastEvent("minecraft:execute_command",eventData)
}

system.boomerangThrow = function(player,playerName,ray)
{

	this.runCommand("execute "+playerName+" ~ ~ ~ summon mason:boomerang ~"+ray[0]+" ~"+(parseFloat(ray[1])+1.52001)+" ~"+ray[2])
	rayCoordinates = "~"+ray[0]+" ~"+ray[1]+" ~"+ray[2]	

	boomerangId = "boomerang_"+Math.floor(Math.random() * 65536);
	this.runCommand("execute "+playerName+" ~ ~ ~ tag @e[type=mason:boomerang,tag=!MasonBoomerangRegistered,c=1,r=5] add "+boomerangId)
	this.runCommand("execute "+playerName+" ~ ~ ~ tag @e[type=mason:boomerang,tag=!MasonBoomerangRegistered,c=1,r=5] add MasonBoomerangRegistered")

	playerPosition = this.getComponent(player,"minecraft:position").data
	originCoordinates = playerPosition.x+" "+playerPosition.y+" "+playerPosition.z

	boomerangFetch = this.getEntitiesFromQuery(boomerangQuery,playerPosition.x-1,playerPosition.y,playerPosition.z-1,playerPosition.x+1,playerPosition.y+2,playerPosition.z+1)

	for(b=0;b<boomerangFetch.length;b++)
	{
		if(boomerangFetch[b].__identifier__=="mason:boomerang")
		{
			boomerangEntity = boomerangFetch[b]
		}
	}

	boomerangs.push({player:player,playerName:playerName,rayCoordinates:rayCoordinates,originCoordinates:originCoordinates,boomerangId:boomerangId,entity:boomerangEntity,tick:0})
}


system.itemUse = function(event)
{
	player = event.data.player
	playerName = event.data.playerName
	ray = event.data.ray

	for(b=0;b<boomerangs.length;b++)
	{
		if(boomerangs[b].playerName==playerName)
		{
			this.runCommand("/give "+playerName+" mason:boomerang")
			this.runCommand("/title "+playerName+" actionbar §4You can only throw one boomerang at a time!")
			this.runCommand("/playsound note.bass "+playerName)
			return
		}
	}
	this.boomerangThrow(player,playerName,ray)
}