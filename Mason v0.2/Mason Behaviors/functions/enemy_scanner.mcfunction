tag @e[type=blaze] add MasonEnemy
tag @e[type=cave_spider] add MasonEnemy
tag @e[type=creeper] add MasonEnemy
tag @e[type=drowned] add MasonEnemy
tag @e[type=elder_guardian] add MasonEnemy
tag @e[type=enderman] add MasonEnemy
tag @e[type=endermite] add MasonEnemy
tag @e[type=evocation_illager] add MasonEnemy
tag @e[type=ghast] add MasonEnemy
tag @e[type=guardian] add MasonEnemy
tag @e[type=husk] add MasonEnemy
tag @e[type=magma_cube] add MasonEnemy
tag @e[type=phantom] add MasonEnemy
tag @e[type=pillager] add MasonEnemy
tag @e[type=ravager] add MasonEnemy
tag @e[type=shulker] add MasonEnemy
tag @e[type=silverfish] add MasonEnemy
tag @e[type=skeleton] add MasonEnemy
tag @e[type=slime] add MasonEnemy
tag @e[type=spider] add MasonEnemy
tag @e[type=stray] add MasonEnemy
tag @e[type=vex] add MasonEnemy
tag @e[type=vindicator] add MasonEnemy
tag @e[type=witch] add MasonEnemy
tag @e[type=wither_skeleton] add MasonEnemy
tag @e[type=zombie] add MasonEnemy
tag @e[type=zombie_pigman] add MasonEnemy
tag @e[type=zombie_villager] add MasonEnemy

scoreboard players add @a MasonScanner 0
scoreboard players add @a MasonScannerC 0

execute @a ~ ~ ~ scoreboard players operation @s MasonScannerS = @s MasonScanner
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=64] MasonScanner 40
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=48] MasonScanner 30
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=32] MasonScanner 20
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=16] MasonScanner 15
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=8] MasonScanner 10
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=4] MasonScanner 5
execute @e[tag=MasonEnemy] ~ ~ ~ scoreboard players set @a[r=2] MasonScanner 1
execute @a ~ ~ ~ scoreboard players operation @s MasonScannerS -= @s MasonScanner
execute @a[scores={MasonScannerS=1..}] ~ ~ ~ scoreboard players operation @s MasonScannerC = @s MasonScanner
execute @a[scores={MasonScannerS=..-1}] ~ ~ ~ title @s actionbar
execute @a[scores={MasonScannerS=..-1}] ~ ~ ~ scoreboard players operation @s MasonScannerC = @s MasonScanner

scoreboard players remove @a[scores={MasonScannerC=1..}] MasonScannerC 1
execute @a[scores={MasonScannerC=3,MasonScanner=5..},tag=MasonScanner] ~ ~ ~ playsound note.pling @s ~ ~ ~ 1 3.5
execute @a[scores={MasonScannerC=3,MasonScanner=5..},tag=MasonScanner] ~ ~ ~ title @s actionbar §6Beep
execute @a[scores={MasonScannerC=0,MasonScanner=5..},tag=MasonScanner] ~ ~ ~ title @s actionbar

execute @a[scores={MasonScanner=1},tag=MasonScanner] ~ ~ ~ playsound note.pling @s ~ ~ ~ 1 3.5
execute @a[scores={MasonScanner=1},tag=MasonScanner] ~ ~ ~ title @s actionbar §6Beep

execute @a[scores={MasonScannerC=0}] ~ ~ ~ scoreboard players operation @s MasonScannerC = @s MasonScanner
