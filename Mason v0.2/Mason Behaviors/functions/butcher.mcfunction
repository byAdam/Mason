tag @e[tag=MasonWhitelist] add MasonButcher
tag @e[type=item] remove MasonButcher
tag @e[type=armor_stand] remove MasonButcher


execute @e[tag=MasonButcher] ~ ~ ~ detect ~ ~ ~.75 butcher 0 kill @s
execute @e[tag=MasonButcher] ~ ~ ~ detect ~ ~ ~-.75 butcher 0 kill @s
execute @e[tag=MasonButcher] ~ ~ ~ detect ~-.75 ~ ~ butcher 0 kill @s
execute @e[tag=MasonButcher] ~ ~ ~ detect ~.75 ~ ~ butcher 0 kill @s