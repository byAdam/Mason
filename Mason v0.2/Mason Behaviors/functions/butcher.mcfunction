tag @e[tag=MasonWhitelist] add MasonButcher
tag @e[type=armor_stand] remove MasonButcher

tag @e[tag=MasonButcher] remove MasonButcherDamage

scoreboard players add @e[tag=MasonButcher] MasonButcherTick 0
scoreboard players set @e[tag=MasonButcher,scores={MasonButcherTick=0}] MasonButcherTick 10
scoreboard players remove @e[tag=MasonButcher] MasonButcherTick 1

execute @e[tag=MasonButcher,scores={MasonButcherTick=0}] ~ ~ ~ detect ~ ~ ~.75 butcher 0 tag @s add MasonButcherDamage
execute @e[tag=MasonButcher,scores={MasonButcherTick=0}] ~ ~ ~ detect ~ ~ ~-.75 butcher 0 tag @s add MasonButcherDamage
execute @e[tag=MasonButcher,scores={MasonButcherTick=0}] ~ ~ ~ detect ~-.75 ~ ~ butcher 0 tag @s add MasonButcherDamage
execute @e[tag=MasonButcher,scores={MasonButcherTick=0}] ~ ~ ~ detect ~.75 ~ ~ butcher 0 tag @s add MasonButcherDamage

execute @e[tag=MasonButcherDamage] ~ ~ ~ playsound game.player.attack.strong @a
execute @e[tag=MasonButcherDamage] ~ ~ ~ summon mason:butcher_damage


