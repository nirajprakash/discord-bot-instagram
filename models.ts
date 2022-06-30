export interface ModelMe {
    id?: string
    counts?: number,
    profileUrl: string,
    since?: string,
    username: string,
    lastPostId?: string
}

export interface ModelMessage {
    [params: string]: any
    
}

export interface ModelInstagram {

    id: string,
    media_url: string,
    media_type: string,
    thumbnail_url: string,
    timestamp: string,
    permalink: string,
    caption: string
}