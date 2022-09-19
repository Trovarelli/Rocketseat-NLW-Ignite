import express, { response }  from "express";
import {PrismaClient} from '@prisma/client'
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hour-string";
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()
// HTTP methods / API RESTful / HTTP Codes
app.get('/ads/:gameId', async (request, response) => {
    const gamesIds: any[] = request.params.gameId.split(',').map(Number)
    const ads = await prisma.ad.findMany({
            select: {
                gameId: true,
                name: true,
                weekDays: true,
                useVoiceChannel: true,
                yearsPlaying: true,
                hourStart: true,
                hourEnd: true,
                discord: true
            },
             where: {
                 gameId: {
                    in: gamesIds
                 }
             },
             orderBy: {
                 createdAt: 'desc'
             }
         })
 
    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
        }
    }))
})

app.post('/ads', async (request, response) => {
    const body: any =  request. body
    

    //validação LIB: Zod
    const ad = await prisma.ad.create({
        data: {
            gameId: body.gameId,
            name: body.name,
            weekDays: body.weekDays.join(','),
            useVoiceChannel: body.useVoiceChannel,
            yearsPlaying: body.yearsPlaying,
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            discord: body.discord

        }
    })

    return response.status(201).json(ad)
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    })

    return response.json({
        discord: ad.discord
    })
})

app.listen(3333) 