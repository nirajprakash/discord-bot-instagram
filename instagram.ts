import axios from "axios";
// import fetch from "node-fetch";
import { stringify } from 'query-string';
import Insta from 'instagram-web-api';
import fs from 'fs';

import path from 'path';
import { config } from 'dotenv';
import moment from "moment";
import { ModelMe, ModelInstagram } from "./models";

//).config();

config();

export class Instagram {

    feeds = async (): Promise<ModelInstagram> => {
        // const { INSTAGRAM_URSERNAME, INSTAGRAM_PASSWORD } = process.env

        let INSTAGRAM_URSERNAME = process.env.INSTAGRAM_URSERNAME
        let INSTAGRAM_PASSWORD = process.env.INSTAGRAM_PASSWORD

        // const client2 = new Insta({ username:INSTAGRAM_URSERNAME, password:INSTAGRAM_PASSWORD })


        const TOKEN = process.env.INSTAGRAM_TOKEN.trim();
        const APP_ID = process.env.INSTAGRAM_APP_ID.trim();
        const USER_ID = process.env.INSTAGRAM_USER_ID.trim();
        console.log("dsd", INSTAGRAM_URSERNAME, INSTAGRAM_PASSWORD, TOKEN)

        // const url = 'https://graph.instagram.com/me/media';
        //  const url = 'https://api.instagram.com/v1/users/self/media/recent';
        //  const url = 'https://graph.instagram.com/v14.0/'+APP_ID


        // var result = await fetch(
        //     url + stringify(params)
        //     , {
        //         method: 'get',

        //         headers: { 'Content-Type': 'application/json' },
        //     }).then(res => res.json())

        try {

            var meState = await this.getState();

            if (!meState["id"]) {
                let url1 = 'https://graph.instagram.com/me'
                let params1 = {
                    access_token: TOKEN,
                    fields: "id,username",
                    // count: 2 // limit
                };

                var res = await axios.get(url1, {
                    params: params1
                })
                meState.id = res.data.id
                meState.username = res.data.username
                console.log('insta posts res: ', res.data);

                this.saveState(meState);
            }


            const url = `https://graph.instagram.com/v14.0/${meState.id}/media`

            var since = meState.since

            var until: string

            if (since) {
                var sinceMoment = moment(since)
                var untilMoment = moment()
                var days = untilMoment.diff(sinceMoment, "days");

                if (days > 0 && days < 7) {
                    until = untilMoment.toISOString();

                } else if (days > 0) {
                    sinceMoment.add(8, 'days')
                    until = sinceMoment.toISOString();
                } else {
                    until = untilMoment.toISOString();

                }

            }


            const params = {
                access_token: TOKEN,
                // fields:
                //     "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
                since: since,
                until: until,
                fields: "id,media_url,media_type,thumbnail_url,timestamp,permalink,caption",
                count: 2 // limit
            };
            // {
            //     access_token: TOKEN,
            //     // fields:
            //     //     "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
            //     since:  "2020-10-09T05:28:06+0000",
            //     until: "2020-10-25T03:12:03+0000",
            //     fields: "id,media_url,media_type,thumbnail_url,timestamp,permalink,caption",
            //     count: 2 // limit
            // };
            console.log('insta posts 2 res: ', url, params);

            var res = await axios.get(url, {
                params: params
            })


            // var result = []
            // console.log('insta posts res 1112: ', res.data);

            if (res.data && res.data.data && res.data.data.length > 0) {
                var data = res.data.data;
                console.log('insta posts res: ', data.length, data.length);

                var post = data[data.length - 1]
                meState.since = post.timestamp;
                this.saveState(meState)
                console.log('insta posts res: ', post);
                return post

            } else {

                meState.since = until ? until : moment().toISOString();
                this.saveState(meState)

                return null
            }

            // if (res.data && res.data.data) {

            //     result = res.data.data.map(element => {

            //         const regexp = /\#\w\w+\s?/g
            //         const text = element.caption.text.replace(regexp, '');

            //         return {
            //             text: text,
            //             // subText: element.description,
            //             image: element.images.standard_resolution.url,
            //             href: element.link
            //         }
            //     });


            // }

            // var res = await client2
            //     .login().then(()=>{

            //     })
            //     console.info("Instagram: 1", res)

            //     await client2
            //             .getProfile()
            //             .then(console.log)

            // console.info("Instagram: ", res)
        } catch (error) {
            console.error(error)
            return null;
        }


    }

    getState = async (): Promise<ModelMe> => {
        let promise = new Promise<ModelMe>((resolve, reject) => {

            let toJson: ModelMe = {
                "id": "",
                profileUrl:"",
                "counts": 0,
                "username": "",
                "since": "",
                "lastPostId": ""
            };
            try {
                toJson = require(path.join(__dirname, `./../public/me.json`));

            } catch (error) {
                fs.writeFile(path.join(__dirname, `./../public/me.json`), JSON.stringify({
                    "id": "",
                    "counts": 0,
                    "lastPost": 0,
                    "lastPostId": 0
                }, null, 4), (err) => {

                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        reject(err);
                    }

                    console.log("\nJSON file has been saved.");
                    reject("JSON file has been saved");
                });


            }

            resolve(toJson)



        });
        var data = await promise;
        console.log("Data: ", data)

        return data

    }


    saveState = async (modelMe: ModelMe) => {
        let promise = new Promise((resolve, reject) => {


            try {
                fs.writeFile(path.join(__dirname, `./../public/me.json`),
                    JSON.stringify(modelMe, null, 4), (err) => {

                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            reject(err);
                        }

                        console.log("\nJSON file has been saved.");
                        resolve(true);
                    });

            } catch (error) {



            }

            resolve(modelMe)



        });
        var data = await promise;
        console.log("Data: ", data)


    }


}

