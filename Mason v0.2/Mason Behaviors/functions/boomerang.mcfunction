tag @e[type=mason:boomerang] remove MasonBoomerangBlacklist
tag @e[type=mason:boomerang] remove MasonBoomerangAir

execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ bedrock 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ obsidian 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ water 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ lava 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ command_block 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ end_portal 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ portal 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ end_portal_frame 0 tag @s add MasonBoomerangBlacklist
execute @e[type=mason:boomerang] ~ ~ ~ detect ~ ~ ~ air 0 tag @s add MasonBoomerangAir

tag @e[type=mason:boomerang,tag=!MasonBoomerangAir] add MasonBoomerangReturn

execute @e[type=mason:boomerang,tag=!MasonBoomerangBlacklist] ~ ~ ~ setblock ~ ~ ~ air 0 destroy

scoreboard players add @e[tag=MasonWhitelist] MasonBoomerangC 0
execute @e[type=mason:boomerang] ~ ~ ~ scoreboard players set @e[tag=MasonWhitelist,type=!mason:boomerang,scores={MasonBoomerangC=0},r=1.5] MasonBoomerangC 20
execute @e[scores={MasonBoomerangC=20},tag=MasonWhitelist] ~ ~ ~ summon mason:boomerang_damage
scoreboard players remove @e[scores={MasonBoomerangC=1..},tag=MasonWhitelist] MasonBoomerangC 1