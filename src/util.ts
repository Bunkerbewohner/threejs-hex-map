import {Promise} from "es6-promise"
import {XHRLoader} from "three"

const fileLoader = new XHRLoader()

export function loadFile(path: string): Promise<string> {
    const url = path + "?cachebuster=" + Math.random() * 9999999
    return new Promise((resolve, reject) => {
        fileLoader.load(url, (result) => {
            resolve(result)
        }, undefined, (error) => {
            reject(error)
        })
    })
}