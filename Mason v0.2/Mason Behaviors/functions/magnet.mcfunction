execute @e[type=item] ~ ~ ~ tp @s ~ ~ ~ facing @p[r=32,tag=MasonMagnet]
execute @e[type=item] ~ ~ ~ detect ^ ^ ^.1 air 0 tp @s ^ ^ ^.2 facing @p[r=32,tag=MasonMagnet]
tag @e[type=item] remove MasonItemInAir
execute @a[tag=MasonMagnet] ~ ~ ~ execute @e[type=item,r=32] ~ ~ ~ detect ~ ~-1 ~ air 0 tag @s add MasonItemInAir 
execute @a[tag=MasonMagnet] ~ ~ ~ execute @e[type=item,r=32,tag=!MasonItemInAir] ~ ~ ~ tp @s ~ ~.1 ~ 