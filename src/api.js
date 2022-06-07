import { _ } from "svelte-i18n";
import { navigate } from "svelte-navigator";
import { writable, get } from "svelte/store";
import { JSONParser } from "@streamparser/json";

import { alerts } from "./components/Alert.svelte";

const { remote } = require("electron");
const main = remote.require("./main.js");

export const token = writable(localStorage.token || null);
token.subscribe((val) => localStorage.token = val)

export const username = writable(localStorage.username || "admin");
username.subscribe((val) => localStorage.username = val)

export const hostname = writable(localStorage.hostname || "localhost");
hostname.subscribe((val) => localStorage.hostname = val)

export const port = writable(parseInt(localStorage.port || 7777));
port.subscribe((val) => localStorage.port = val)

let isSubscribed = false;

function request(req) {
    const curToken = get(token);
    if (curToken != null) {
        req.authToken = curToken;
        if (!isSubscribed && req.command != "SUBSCRIBE") {
            subscribe();
        }
    }

    const request = new Promise((resolve, reject) => {
        main.request(get(hostname), get(port), req, data => {
            if (data.status == "SUCCESS")
                resolve(data.payload ? data.payload.value : null);
            else {
                if (data.payload.value == "unauthenticated") {
                    navigate("/");
                    resolve(null);
                } else
                    reject(data.payload.value);
            }
        }, error => reject(error));
    });

    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, 3000);
    });
    
    return Promise.race([request, timeout]);
}

function onEvent(event) {
    if (event.type == "ru.sigsegv.emokid.common.model.EventUpdate")
        onUpdateEvent(event.value);
    if (event.type == "ru.sigsegv.emokid.common.model.EventDelete")
        onDeleteEvent(event.value);
}

const updateSubscribers = new Set();

function onUpdateEvent(event) {
    for (let sub of updateSubscribers) {
        sub(event);
    }
}

const deleteSubscribers = new Set();

function onDeleteEvent(event) {
    for (let sub of deleteSubscribers) {
        sub(event);
    }
}

function subscribe() {
    let req = {
        command: "SUBSCRIBE",
        authToken: get(token)
    };

    const onValue = (events, key, parent, stack) => {
        if (stack.length > 0) return;
        for (let event of events) {
            onEvent(event);
        }
    };

    let parser = new JSONParser();
    parser.onValue = onValue;

    let destroy = main.rawRequest(get(hostname), get(port), req, chunk => {
        if (parser.isEnded) {
            parser = new JSONParser();
            parser.onValue = onValue;
        }
        parser.write(chunk);
    }, error => {
        destroy();
        isSubscribed = false;
    });

    isSubscribed = true;
}

function loginOrRegister(username, password, command) {
    return request({
        command: command,
        argument: {
            type: "ru.sigsegv.emokid.common.model.Credentials",
            value: {
                username: username,
                password: password,
            }
        }
    });
}

export async function login(n, p) {
    username.set(n);
    let t = await loginOrRegister(n, p, "LOGIN");
    token.set(t);
    subscribe();
    return t;
}

export function register(username, password) {
    return loginOrRegister(username, password, "REGISTER");
}

export const musicBands = (() => {
    let bands = [];
    const subs = new Set();

    const notify = () => {
        for (const sub of subs) {
            sub(bands);
        }
    };

    const set = (val) => {
        bands = val;
        notify();
    };

    const handleUpdate = (event) => {
        const idx = bands.findIndex(b => b.id == event.band.id);
        if (idx != -1) {
            bands[idx] = musicBandToJS(event.band);
            notify();
        } else {
            set([...bands, musicBandToJS(event.band)]);
        }
    };

    const handleDelete = (event) => {
        set(bands.filter(b => b.id != event.id));
    };

    return {
        subscribe: callback => {
            subs.add(callback);
            callback(bands);

            if (subs.size == 1) {
                fetchMusicBands()
                    .then(data => {
                        set(data.map(b => musicBandToJS(b.value)))
                    }, e => {
                        alerts.set([...get(alerts), {
                            title: get(_)("fetch.error"),
                            short: get(_)("fetch.error.short"),
                            details: e
                        }]);
                    });

                updateSubscribers.add(handleUpdate);
                deleteSubscribers.add(handleDelete);
            }

            return () => {
                subs.delete(callback);
                if (subs.size == 0) {
                    updateSubscribers.delete(handleUpdate);
                    deleteSubscribers.delete(handleDelete);
                }
            };
        },

        update: (id, band) => {
            band = Object.assign({}, band);
            band.id = id;
            request({
                command: "UPDATE",
                argument: {
                    type: "ru.sigsegv.emokid.common.model.MusicBand",
                    value: musicBandFromJS(band)
                }
            });
        },

        add: band => {
            band = Object.assign({}, band);
            request({
                command: "ADD",
                argument: {
                    type: "ru.sigsegv.emokid.common.model.MusicBand",
                    value: musicBandFromJS(band)
                }
            });
        },

        addIfMax: band => {
            band = Object.assign({}, band);
            request({
                command: "ADD_IF_MAX",
                argument: {
                    type: "ru.sigsegv.emokid.common.model.MusicBand",
                    value: musicBandFromJS(band)
                }
            });
        },

        remove: id => {
            set(bands.filter(b => b.owner != get(username) || b.id != id));
            request({
                command: "REMOVE_BY_ID",
                argument: {
                    type: "java.lang.Long",
                    value: parseInt(id)
                }
            });
        },

        removeLower: band => {
            band = Object.assign({}, band);
            request({
                command: "REMOVE_LOWER",
                argument: {
                    type: "ru.sigsegv.emokid.common.model.MusicBand",
                    value: musicBandFromJS(band)
                }
            });
        },

        removeGreater: band => {
            band = Object.assign({}, band);
            request({
                command: "REMOVE_GREATER",
                argument: {
                    type: "ru.sigsegv.emokid.common.model.MusicBand",
                    value: musicBandFromJS(band)
                }
            });
        }
    };
})();

function fetchMusicBands() {
    return request({
        "command": "SHOW"
    });
}

function musicBandToJS(band) {
    return {
        id: band.id,
        owner: band.owner,
        name: band.name,
        coordX: band.coordinates.x,
        coordY: band.coordinates.y,
        created: new Date(band.creationDate.replace(/\[[^\]]*\]$/, "")),
        np: band.numberOfParticipants,
        description: band.description,
        genre: band.genre,
        studioName: band.studio == null ? null : band.studio.name,
        studioAddress: band.studio == null ? null : band.studio.address
    }
}

function musicBandFromJS(band) {
    let res = {
        id: band.id || 0,
        name: band.name,
        coordinates: {
            x: band.coordX,
            y: band.coordY
        },
        creationDate: band.created ? band.created.toISOString() : null,
        numberOfParticipants: parseInt(band.np),
        description: band.description,
        genre: band.genre,
        studio: {
            name: band.studioName,
            address: band.studioAddress
        }
    };

    if (!res.creationDate) delete res.creationDate;
    if (!res.genre) delete res.genre;
    if (!res.studio.name) delete res.studio;
    if (res.studio && !res.studio.address) delete res.studio.address;

    return res;
}
