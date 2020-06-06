import express, { Request, Response } from 'express'
import knex from '../database/connection'


class PointdControler {
    
    async create(request: Request ,response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longetude,
            city,
            uf,
            items
        }  = request.body;
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longetude,
            city,
            uf
        }

        const trx = await knex.transaction()
    
        const ids = await trx('points').insert(point)
        const point_id = ids[0]
        const pointItems = items
            .split(',')
            .map((item_id: string)=> Number(item_id.trim()))
            .map((item_id: number) =>{
            return {
                item_id,
                point_id
            }
        })
    
        await trx('points-itens').insert(pointItems);

        await trx.commit()
        
        return response.json({id:point_id,point})
    }

    async show (request: Request ,response: Response){
        const {id} = request.params
        const point =  await knex('points').where('id',id).first()

        if(!point){
            return response.status(400).json({message:'Ponit Not Found'})
        }

        const seriaLizedpoint= {
            ...point,
            image_url: `http://192.168.0.110:3333/uploads/${point.image}`
        }
        const items =  await knex('items')
                        .join('points-itens','items.id','=','points-itens.item_id')
                        .where('points-itens.point_id',id).select('items.title')
         
        return response.json({point,items})
    }

    async index (request: Request ,response: Response){
        const {city,uf,items} = request.query
        
        const parsedItens =  String(items).split(',').map(item => Number(item.trim()))
        
        const points = await knex('points')
                            .join('points-itens','points.id','=','points-itens.point_id')
                            .whereIn('points-itens.item_id',parsedItens)
                            .where('city',String(city))
                            .where('uf',String(uf))
                            .distinct()
                            .select('points.*')
        const serializedPoinst = points.map( point =>{
            return{
                ...point,
                image_url: `http://192.168.0.110:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoinst)
    }

}

export default PointdControler;