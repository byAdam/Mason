tag @e[tag=MasonWhitelist] remove MasonConveyorNorth
tag @e[tag=MasonWhitelist] remove MasonConveyorSouth
tag @e[tag=MasonWhitelist] remove MasonConveyorEast
tag @e[tag=MasonWhitelist] remove MasonConveyorWest

execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~-.01 ~ conveyor_belt_north 0 tag @s add MasonConveyorNorth
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~-.01 ~ conveyor_belt_south 0 tag @s add MasonConveyorSouth
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~-.01 ~ conveyor_belt_east 0 tag @s add MasonConveyorEast
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~-.01 ~ conveyor_belt_west 0 tag @s add MasonConveyorWest

execute @e[tag=MasonConveyorNorth] ~ ~ ~ detect ~ ~ ~-.05 air 0 tp @s ~ ~ ~-.05
execute @e[tag=MasonConveyorSouth] ~ ~ ~ detect ~ ~ ~.05 air 0 tp @s ~ ~ ~.05
execute @e[tag=MasonConveyorEast] ~ ~ ~ detect ~.05 ~ ~ air 0 tp @s ~.05 ~ ~
execute @e[tag=MasonConveyorWest] ~ ~ ~ detect ~-.05 ~ ~ air 0 tp @s ~-.05 ~ ~

execute @e[tag=MasonWhitelist,tag=!MasonConveyorNorth] ~ ~ ~ detect ~ ~-.01 ~.45 conveyor_belt_north 0 tp @s ~ ~ ~-.0625
execute @e[tag=MasonWhitelist,tag=!MasonConveyorSouth] ~ ~ ~ detect ~ ~-.01 ~-.45 conveyor_belt_south 0 tp @s ~ ~ ~.0625
execute @e[tag=MasonWhitelist,tag=!MasonConveyorEast] ~ ~ ~ detect ~-.45 ~-.01 ~ conveyor_belt_east 0 tp @s ~.0625 ~ ~
execute @e[tag=MasonWhitelist,tag=!MasonConveyorWest] ~ ~ ~ detect ~.45 ~-.01 ~ conveyor_belt_west 0 tp @s ~-.0625 ~ ~

execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~ ~.25 conveyor_belt_up 0 execute @s ~ ~ ~ tp @s ~ ~.0625 ~
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~ ~ ~-.25 conveyor_belt_up 0 tp @s ~ ~.0625 ~
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~.25 ~ ~ conveyor_belt_up 0 tp @s ~ ~.0625 ~
execute @e[tag=MasonWhitelist] ~ ~ ~ detect ~-.25 ~ ~ conveyor_belt_up 0 tp @s ~ ~.0625 ~