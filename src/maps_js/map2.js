import {TileMap, importMAPJsonFromFile, CollideBox} from "./../../engine.js"
import {Coin, RedBlock, SurpriseBox, Enemy} from "./../../object.js"

//const json = require('./map/map1.json'); //(with path)

//var tilemap = new TileMap(map, "src/tilesets/tileset_1.png", "id_map", 0, 8, 8, 2)
var map = await importMAPJsonFromFile("src/map/marioBeachLvl.tmj")
//console.log(map, "map script")

var tilemap = new TileMap(map, 2, 2)
tilemap.offsetX = 0
tilemap.offsetY = 0
const spawn = {x: 150, y: 150}
var walls = []
var objects = []
var flag = []
var doorCastle = []
var piques = []
var loaded = false
const divWall = [ 1, 2, 3, 4, 5, 6, 8, 9, 17, 18, 40, 44, 46, 48, 91, 92, 93, 94, 102, 115, 116, 117, 120, 121, 122, 136, 137]
const divPic = []
const divFlag = [27, 36, 81]
const divDoorCastle = 52
const dictionnaire_obj = {
    61: Coin,
    38: RedBlock,
    14: SurpriseBox,
    45: Enemy,
}

let tile_streak = { start: undefined, end: undefined }
tilemap.onMapLoad = () => {
    tilemap.map_by_layer.forEach(element => {
        element.forEach((row, ind_y) => {

            row.forEach((gid, ind_x) => {
                let isWall = false
               
                for (let i = 0; i < divWall.length; i++) {
                    if (divWall[i] == gid) {
                        isWall = true
                        break;
                    }
                }
                for (let i = 0; i < divFlag.length; i++) {
                    if (divFlag[i] == gid) {
                        flag.push(new CollideBox(
                            ind_x * tilemap.json_map.tilewidth * tilemap.scale,
                            ind_y * tilemap.json_map.tileheight * tilemap.scale,
                            tilemap.json_map.tilewidth * tilemap.scale,
                            tilemap.json_map.tileheight * tilemap.scale
                        ))
                        break;
                    }
                }
                if (divDoorCastle == gid) {
                    doorCastle.push(new CollideBox(
                        ind_x * tilemap.json_map.tilewidth * tilemap.scale,
                        ind_y * tilemap.json_map.tileheight * tilemap.scale,
                        tilemap.json_map.tilewidth * tilemap.scale,
                        tilemap.json_map.tileheight * tilemap.scale
                    ))
                }
                for (let i = 0; i < divPic.length; i++) {
                    if (divPic[i] == gid) {
                        piques.push(new CollideBox(
                            ind_x * tilemap.json_map.tilewidth * tilemap.scale,
                            ind_y * tilemap.json_map.tileheight * tilemap.scale,
                            tilemap.json_map.tilewidth * tilemap.scale,
                            tilemap.json_map.tileheight * tilemap.scale
                        ))
                        break;
                    }
                }

                if (isWall && tile_streak.start === undefined) {
                    tile_streak.start = ind_x
                }

                if ((!isWall && !(tile_streak.start === undefined)) || (!(tile_streak.start === undefined) && ind_x === row.length - 1)) {
                    tile_streak.end = ind_x - 1

                    walls.push(new CollideBox(
                        tile_streak.start * tilemap.json_map.tilewidth * tilemap.scale,
                        ind_y * tilemap.json_map.tileheight * tilemap.scale,
                        (tile_streak.end - tile_streak.start) * tilemap.json_map.tilewidth * tilemap.scale,
                        tilemap.json_map.tileheight * tilemap.scale
                    ))

                    tile_streak = { start: undefined, end: undefined }
                }
            })


        })
    });
    // console.log(walls)

    let layers_objects_to_create = tilemap.json_map.layers.filter((lay) => lay.type == "objectgroup")
    // console.log(layers_objects_to_create)
    layers_objects_to_create.forEach((layer) => {
        layer.objects.forEach((obj) => {
            if (!(dictionnaire_obj[obj.gid] === undefined)) {
                let temp_obj = new dictionnaire_obj[obj.gid]
                temp_obj.x = (obj.x) * tilemap.scale;
                temp_obj.y = (obj.y - 1 * tilemap.json_map.tileheight) * tilemap.scale;
                temp_obj.sprite.scale = tilemap.scale
				temp_obj.gid = obj.gid
                objects.push(temp_obj)
            }
        })
    })

   
    loaded = true 
}
export {walls, objects, flag, piques, doorCastle, tilemap, spawn, loaded, dictionnaire_obj}