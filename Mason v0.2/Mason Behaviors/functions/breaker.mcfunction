execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ bedrock 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ obsidian 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ water 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ lava 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ command_block 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ end_portal 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ portal 0 tag @s add MasonBoomerangBlacklist
execute @e[type=item,name="Breaker"] ~ ~ ~ detect ~ ~ ~ end_portal_frame 0 tag @s add MasonBoomerangBlacklist

execute @e[type=item,name="Breaker",tag=!MasonBoomerangBlacklist] ~ ~ ~ setblock ~ ~ ~ air 0 destroy
kill @e[type=item,name="Breaker"]